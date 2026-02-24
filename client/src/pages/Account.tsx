import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, LogOut, User, Mail, Calendar, Shield, Loader2, Crown, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

export default function Account() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🐾</div>
          <h2 className="text-2xl font-bold text-primary mb-2">join the capy fam</h2>
          <p className="text-muted-foreground mb-6">
            sign in to get your own account, save your quiz scores, customize the site, and more.
          </p>
          <Button
            className="rounded-full px-8"
            onClick={() => { window.location.href = getLoginUrl("/account"); }}
          >
            sign in
          </Button>
          <div className="mt-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary no-underline">
              ← back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isAdmin = user?.role === "admin";

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "CF";

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "recently";

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
            <h1 className="text-lg font-bold text-primary">my account</h1>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                <ShieldCheck className="h-3 w-3" />
                admin
              </span>
            )}
          </div>
          <Link href="/settings">
            <Button variant="outline" size="sm" className="gap-2 rounded-full">
              <Settings className="h-4 w-4" />
              settings
            </Button>
          </Link>
        </div>
      </div>

      <div className="container py-8 max-w-2xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className={`h-24 ${isAdmin ? "bg-gradient-to-r from-primary/30 via-primary/20 to-accent/30" : "bg-gradient-to-r from-primary/20 to-accent/30"}`} />
          <div className="px-6 pb-6 -mt-10">
            <div className="flex items-end gap-4 mb-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold border-4 border-card shadow-lg">
                  {initials}
                </div>
                {isAdmin && (
                  <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md border-2 border-card">
                    <Crown className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{user?.name || "capy fan"}</h2>
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-primary-foreground uppercase tracking-wider">
                      admin
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {isAdmin ? "site administrator" : "member of the capy fam"}
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">name</p>
                  <p className="text-sm font-semibold">{user?.name || "not set"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">email</p>
                  <p className="text-sm font-semibold">{user?.email || "not set"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">role</p>
                  <p className="text-sm font-semibold flex items-center gap-1.5">
                    {isAdmin ? (
                      <>
                        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                        administrator
                      </>
                    ) : (
                      "member"
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">joined</p>
                  <p className="text-sm font-semibold">{joinDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">sign in method</p>
                  <p className="text-sm font-semibold">{user?.loginMethod || "manus auth"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Panel Link (only for admins) */}
        {isAdmin && (
          <Link href="/admin">
            <div className="bg-card rounded-2xl border-2 border-primary/20 p-5 shadow-sm hover:border-primary/40 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Crown className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-primary">admin panel</h3>
                  <p className="text-sm text-muted-foreground">manage users, view stats, and control the site</p>
                </div>
                <ArrowLeft className="h-5 w-5 text-muted-foreground rotate-180" />
              </div>
            </div>
          </Link>
        )}

        {/* Quick Links */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-bold mb-4">quick links</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/settings">
              <div className="p-4 bg-accent/50 rounded-xl hover:bg-accent transition-colors cursor-pointer text-center">
                <Settings className="h-5 w-5 mx-auto mb-1 text-accent-foreground" />
                <span className="text-xs font-bold">customize appearance</span>
              </div>
            </Link>
            <Link href="/#quiz">
              <div className="p-4 bg-accent/50 rounded-xl hover:bg-accent transition-colors cursor-pointer text-center">
                <span className="text-xl block mb-1">🧠</span>
                <span className="text-xs font-bold">take the quiz</span>
              </div>
            </Link>
            <Link href="/#gallery">
              <div className="p-4 bg-accent/50 rounded-xl hover:bg-accent transition-colors cursor-pointer text-center">
                <span className="text-xl block mb-1">📸</span>
                <span className="text-xs font-bold">photo gallery</span>
              </div>
            </Link>
            <Link href="/#pet-laws">
              <div className="p-4 bg-accent/50 rounded-xl hover:bg-accent transition-colors cursor-pointer text-center">
                <span className="text-xl block mb-1">🗺️</span>
                <span className="text-xs font-bold">pet law map</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Sign Out */}
        <div className="text-center pb-8">
          <Button
            variant="outline"
            className="rounded-full gap-2 text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/50 hover:bg-destructive/5"
            onClick={async () => {
              await logout();
              window.location.href = "/";
            }}
          >
            <LogOut className="h-4 w-4" />
            sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
