import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Sun, Moon, Type, Palette, Sparkles, Check, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const accentColors = [
  { name: "brown", label: "classic capy", preview: "bg-[oklch(0.45_0.08_55)]" },
  { name: "green", label: "sage forest", preview: "bg-[oklch(0.45_0.12_145)]" },
  { name: "pink", label: "rosy vibes", preview: "bg-[oklch(0.55_0.18_10)]" },
  { name: "blue", label: "ocean chill", preview: "bg-[oklch(0.45_0.15_240)]" },
  { name: "purple", label: "grape soda", preview: "bg-[oklch(0.45_0.15_300)]" },
  { name: "orange", label: "sunset glow", preview: "bg-[oklch(0.55_0.15_55)]" },
];

const fontSizes = [
  { value: "small" as const, label: "small", desc: "compact and cozy" },
  { value: "medium" as const, label: "medium", desc: "just right" },
  { value: "large" as const, label: "large", desc: "big and bold" },
];

export default function Settings() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [accentColor, setAccentColor] = useState("brown");
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [showCursorTrail, setShowCursorTrail] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  const prefsQuery = trpc.preferences.get.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  const saveMutation = trpc.preferences.save.useMutation({
    onSuccess: () => {
      toast.success("settings saved! your vibes are updated 🐾");
      setHasChanges(false);
      // Store in localStorage for immediate application
      localStorage.setItem("baravibes-prefs", JSON.stringify({ theme, accentColor, fontSize, showCursorTrail: showCursorTrail ? 1 : 0 }));
    },
    onError: () => {
      toast.error("couldn't save settings. try again?");
    },
  });

  // Load saved preferences
  useEffect(() => {
    if (prefsQuery.data) {
      setTheme(prefsQuery.data.theme as "light" | "dark");
      setAccentColor(prefsQuery.data.accentColor);
      setFontSize(prefsQuery.data.fontSize as "small" | "medium" | "large");
      setShowCursorTrail(prefsQuery.data.showCursorTrail === 1);
    }
  }, [prefsQuery.data]);

  const handleSave = () => {
    saveMutation.mutate({
      theme,
      accentColor,
      fontSize,
      showCursorTrail: showCursorTrail ? 1 : 0,
    });
  };

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-primary mb-2">sign in to customize</h2>
          <p className="text-muted-foreground mb-6">
            you need to be signed in to change your settings. sign in and make this site yours!
          </p>
          <Button
            className="rounded-full px-8"
            onClick={() => { window.location.href = getLoginUrl("/settings"); }}
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

  if (authLoading || prefsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
            <h1 className="text-lg font-bold text-primary">settings</h1>
          </div>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saveMutation.isPending}
            className="rounded-full gap-2"
          >
            {saveMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            save changes
          </Button>
        </div>
      </div>

      <div className="container py-8 max-w-2xl mx-auto space-y-8">
        {/* Welcome */}
        <div className="text-center mb-2">
          <p className="text-muted-foreground text-sm">
            hey {user?.name?.split(" ")[0]?.toLowerCase() || "friend"}, make this site feel like yours
          </p>
        </div>

        {/* Theme */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-accent rounded-full p-2">
              {theme === "dark" ? <Moon className="h-5 w-5 text-accent-foreground" /> : <Sun className="h-5 w-5 text-accent-foreground" />}
            </div>
            <div>
              <h3 className="font-bold">theme</h3>
              <p className="text-xs text-muted-foreground">light or dark, you pick</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { setTheme("light"); setHasChanges(true); }}
              className={`rounded-xl p-4 border-2 transition-all ${
                theme === "light"
                  ? "border-primary bg-white shadow-md"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sun className="h-4 w-4" />
                <span className="font-bold text-sm">light</span>
              </div>
              <div className="rounded-lg bg-[oklch(0.98_0.008_85)] border border-[oklch(0.9_0.02_85)] p-2 space-y-1">
                <div className="h-2 w-3/4 bg-[oklch(0.45_0.08_55)] rounded-full" />
                <div className="h-1.5 w-full bg-[oklch(0.9_0.02_85)] rounded-full" />
                <div className="h-1.5 w-2/3 bg-[oklch(0.9_0.02_85)] rounded-full" />
              </div>
            </button>
            <button
              onClick={() => { setTheme("dark"); setHasChanges(true); }}
              className={`rounded-xl p-4 border-2 transition-all ${
                theme === "dark"
                  ? "border-primary bg-white shadow-md"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Moon className="h-4 w-4" />
                <span className="font-bold text-sm">dark</span>
              </div>
              <div className="rounded-lg bg-[oklch(0.2_0.02_260)] border border-[oklch(0.3_0.02_260)] p-2 space-y-1">
                <div className="h-2 w-3/4 bg-[oklch(0.7_0.08_55)] rounded-full" />
                <div className="h-1.5 w-full bg-[oklch(0.3_0.02_260)] rounded-full" />
                <div className="h-1.5 w-2/3 bg-[oklch(0.3_0.02_260)] rounded-full" />
              </div>
            </button>
          </div>
        </div>

        {/* Accent Color */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-accent rounded-full p-2">
              <Palette className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-bold">accent color</h3>
              <p className="text-xs text-muted-foreground">changes buttons, links, and highlights</p>
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {accentColors.map((c) => (
              <button
                key={c.name}
                onClick={() => { setAccentColor(c.name); setHasChanges(true); }}
                className={`rounded-xl p-3 border-2 transition-all text-center ${
                  accentColor === c.name
                    ? "border-primary shadow-md"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <div className={`w-8 h-8 rounded-full mx-auto mb-1.5 ${c.preview}`} />
                <span className="text-[10px] font-bold leading-tight block">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-accent rounded-full p-2">
              <Type className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-bold">text size</h3>
              <p className="text-xs text-muted-foreground">make everything bigger or smaller</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {fontSizes.map((f) => (
              <button
                key={f.value}
                onClick={() => { setFontSize(f.value); setHasChanges(true); }}
                className={`rounded-xl p-4 border-2 transition-all text-center ${
                  fontSize === f.value
                    ? "border-primary shadow-md"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <span className={`font-bold block mb-1 ${
                  f.value === "small" ? "text-xs" : f.value === "medium" ? "text-sm" : "text-lg"
                }`}>
                  Aa
                </span>
                <span className="text-xs font-bold">{f.label}</span>
                <span className="text-[10px] text-muted-foreground block">{f.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cursor Trail */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-accent rounded-full p-2">
                <Sparkles className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-bold">paw print cursor trail</h3>
                <p className="text-xs text-muted-foreground">little paw prints follow your mouse around</p>
              </div>
            </div>
            <Switch
              checked={showCursorTrail}
              onCheckedChange={(checked) => { setShowCursorTrail(checked); setHasChanges(true); }}
            />
          </div>
        </div>

        {/* Preview hint */}
        <div className="text-center text-xs text-muted-foreground pb-8">
          <p>changes will apply after you save. go back home to see the full effect!</p>
        </div>
      </div>
    </div>
  );
}
