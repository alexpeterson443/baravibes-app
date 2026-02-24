import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ArrowLeft,
  Users,
  Mail,
  BarChart3,
  Shield,
  ShieldCheck,
  Trash2,
  UserX,
  Loader2,
  Crown,
  RefreshCw,
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
        <span className="text-sm text-muted-foreground font-semibold">{label}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

export default function Admin() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"users" | "subscribers">("users");

  const isAdminUser = isAuthenticated && user?.role === "admin";

  const statsQuery = trpc.admin.stats.useQuery(undefined, {
    enabled: isAdminUser,
    retry: false,
    refetchInterval: isAdminUser ? 10000 : false,
  });
  const usersQuery = trpc.admin.users.list.useQuery(undefined, {
    enabled: isAdminUser,
    retry: false,
    refetchInterval: isAdminUser ? 10000 : false,
  });
  const subscribersQuery = trpc.admin.subscribers.list.useQuery(undefined, {
    enabled: isAdminUser,
    retry: false,
    refetchInterval: isAdminUser ? 10000 : false,
  });

  const utils = trpc.useUtils();

  const updateRoleMutation = trpc.admin.users.updateRole.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        toast.success("role updated");
        utils.admin.users.list.invalidate();
        utils.admin.stats.invalidate();
      } else {
        toast.error("message" in result ? result.message : "failed to update role");
      }
    },
    onError: () => toast.error("failed to update role"),
  });

  const deleteUserMutation = trpc.admin.users.delete.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        toast.success("user removed");
        utils.admin.users.list.invalidate();
        utils.admin.stats.invalidate();
      } else {
        toast.error("message" in result ? result.message : "failed to delete user");
      }
    },
    onError: () => toast.error("failed to delete user"),
  });

  const removeSubMutation = trpc.admin.subscribers.remove.useMutation({
    onSuccess: () => {
      toast.success("subscriber removed");
      utils.admin.subscribers.list.invalidate();
      utils.admin.stats.invalidate();
    },
    onError: () => toast.error("failed to remove subscriber"),
  });

  // Auth guard
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-primary mb-2">admin only</h2>
          <p className="text-muted-foreground mb-6">
            this area is restricted to site administrators. if you think you should have access, contact the site owner.
          </p>
          <Link href="/">
            <Button className="rounded-full px-8">back to home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const stats = statsQuery.data;
  const usersList = usersQuery.data || [];
  const subscribersList = subscribersQuery.data || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                home
              </Button>
            </Link>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-bold text-primary">admin panel</h1>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-full"
            onClick={() => {
              utils.admin.stats.invalidate();
              utils.admin.users.list.invalidate();
              utils.admin.subscribers.list.invalidate();
              toast.success("refreshed");
            }}
          >
            <RefreshCw className="h-4 w-4" />
            refresh
          </Button>
        </div>
        <div className="container flex items-center gap-2 pb-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">live — auto-refreshes every 10s</span>
        </div>
      </div>

      <div className="container py-8 max-w-4xl mx-auto space-y-8">
        {/* Stats Grid */}
        <div>
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">site overview</h2>
          {statsQuery.isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={<Users className="h-5 w-5" />} label="total users" value={stats?.totalUsers ?? 0} />
              <StatCard icon={<Shield className="h-5 w-5" />} label="admins" value={stats?.adminCount ?? 0} />
              <StatCard icon={<Mail className="h-5 w-5" />} label="subscribers" value={stats?.activeSubscribers ?? 0} />
              <StatCard icon={<BarChart3 className="h-5 w-5" />} label="total signups" value={stats?.totalSubscribers ?? 0} />
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 text-sm font-bold transition-colors border-b-2 -mb-px ${
              activeTab === "users"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            users ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab("subscribers")}
            className={`px-4 py-2 text-sm font-bold transition-colors border-b-2 -mb-px ${
              activeTab === "subscribers"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Mail className="h-4 w-4 inline mr-2" />
            newsletter ({subscribersList.filter((s) => s.active === 1).length})
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-3">
            {usersQuery.isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : usersList.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">no users yet</p>
            ) : (
              <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left px-4 py-3 font-bold text-muted-foreground">user</th>
                        <th className="text-left px-4 py-3 font-bold text-muted-foreground hidden md:table-cell">email</th>
                        <th className="text-left px-4 py-3 font-bold text-muted-foreground">role</th>
                        <th className="text-left px-4 py-3 font-bold text-muted-foreground hidden md:table-cell">sign in method</th>
                        <th className="text-left px-4 py-3 font-bold text-muted-foreground hidden md:table-cell">last active</th>
                        <th className="text-right px-4 py-3 font-bold text-muted-foreground">actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((u) => (
                        <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                                {u.name?.[0]?.toUpperCase() || "?"}
                              </div>
                              <div>
                                <p className="font-semibold">{u.name || "unnamed"}</p>
                                <p className="text-xs text-muted-foreground md:hidden">{u.email || "no email"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{u.email || "—"}</td>
                          <td className="px-4 py-3">
                            {u.role === "admin" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
                                <ShieldCheck className="h-3 w-3" />
                                admin
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-muted text-muted-foreground">
                                user
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell">
                            {u.loginMethod || "—"}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell">
                            {u.lastSignedIn ? formatTimeAgo(new Date(u.lastSignedIn)) : u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 justify-end">
                              {u.id !== user?.id && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 text-xs"
                                    disabled={updateRoleMutation.isPending}
                                    onClick={() => {
                                      const newRole = u.role === "admin" ? "user" : "admin";
                                      if (newRole === "admin") {
                                        if (!confirm(`make ${u.name || "this user"} an admin?`)) return;
                                      }
                                      updateRoleMutation.mutate({ userId: u.id, role: newRole });
                                    }}
                                  >
                                    {u.role === "admin" ? (
                                      <><UserX className="h-3.5 w-3.5 mr-1" />demote</>
                                    ) : (
                                      <><ShieldCheck className="h-3.5 w-3.5 mr-1" />make admin</>
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 text-xs text-destructive hover:text-destructive"
                                    disabled={deleteUserMutation.isPending}
                                    onClick={() => {
                                      if (!confirm(`delete ${u.name || "this user"}? this can't be undone.`)) return;
                                      deleteUserMutation.mutate({ userId: u.id });
                                    }}
                                  >
                                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                                    delete
                                  </Button>
                                </>
                              )}
                              {u.id === user?.id && (
                                <span className="text-xs text-muted-foreground italic">you</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Subscribers Tab */}
        {activeTab === "subscribers" && (
          <div className="space-y-3">
            {subscribersQuery.isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : subscribersList.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">no subscribers yet</p>
            ) : (
              <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left px-4 py-3 font-bold text-muted-foreground">email</th>
                        <th className="text-left px-4 py-3 font-bold text-muted-foreground">status</th>
                        <th className="text-left px-4 py-3 font-bold text-muted-foreground hidden md:table-cell">subscribed</th>
                        <th className="text-right px-4 py-3 font-bold text-muted-foreground">actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribersList.map((sub) => (
                        <tr key={sub.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 font-semibold">{sub.email}</td>
                          <td className="px-4 py-3">
                            {sub.active === 1 ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-muted text-muted-foreground">
                                inactive
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell">
                            {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString() : "—"}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {sub.active === 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs text-destructive hover:text-destructive"
                                disabled={removeSubMutation.isPending}
                                onClick={() => {
                                  if (!confirm(`unsubscribe ${sub.email}?`)) return;
                                  removeSubMutation.mutate({ id: sub.id });
                                }}
                              >
                                <UserX className="h-3.5 w-3.5 mr-1" />
                                unsubscribe
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
