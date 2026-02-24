import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X, LogOut, Settings, UserCircle, Crown, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "about", href: "#about" },
  { label: "facts", href: "#facts" },
  { label: "gallery", href: "#gallery" },
  { label: "pet laws", href: "#pet-laws" },
  { label: "quiz", href: "#quiz" },
  { label: "sounds", href: "#soundboard" },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAdmin = user?.role === "admin";

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "CF";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 no-underline">
          <span className="text-2xl">🐾</span>
          <span className="font-display text-2xl text-primary">BaraVibes</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-foreground/70 hover:text-primary transition-colors no-underline"
            >
              {link.label}
            </a>
          ))}

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full bg-primary text-primary-foreground h-9 pl-1 pr-3 hover:opacity-90 transition-opacity">
                  <div className="relative">
                    <div className="w-7 h-7 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xs font-bold">
                      {initials}
                    </div>
                    {isAdmin && (
                      <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-yellow-400 flex items-center justify-center">
                        <Crown className="h-2 w-2 text-yellow-900" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-semibold max-w-[100px] truncate">
                    {user.name?.split(" ")[0]?.toLowerCase() || "capy fan"}
                  </span>
                  {isAdmin && (
                    <span className="text-[10px] font-bold bg-primary-foreground/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      admin
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover text-popover-foreground">
                <div className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm">{user.name || "capy fan"}</p>
                    {isAdmin && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                        <ShieldCheck className="h-2.5 w-2.5" />
                        admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{user.email || "signed in"}</p>
                </div>
                <DropdownMenuSeparator />
                <Link href="/account">
                  <DropdownMenuItem className="cursor-pointer">
                    <UserCircle className="h-4 w-4 mr-2" />
                    my account
                  </DropdownMenuItem>
                </Link>
                <Link href="/settings">
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="h-4 w-4 mr-2" />
                    settings
                  </DropdownMenuItem>
                </Link>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <Link href="/admin">
                      <DropdownMenuItem className="cursor-pointer text-primary focus:text-primary">
                        <Crown className="h-4 w-4 mr-2" />
                        admin panel
                      </DropdownMenuItem>
                    </Link>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={async () => {
                    await logout();
                    window.location.href = "/";
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              className="bg-primary text-primary-foreground rounded-full px-5"
              onClick={() => {
                window.location.href = getLoginUrl();
              }}
            >
              sign in
            </Button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border px-4 py-4 space-y-3 animate-fade-in-up">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-sm font-semibold text-foreground/70 hover:text-primary no-underline py-1"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          {isAuthenticated && user ? (
            <div className="pt-2 border-t border-border space-y-2">
              <div className="flex items-center gap-3 py-2">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {initials}
                  </div>
                  {isAdmin && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center">
                      <Crown className="h-2.5 w-2.5 text-yellow-900" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold">{user.name || "capy fan"}</p>
                    {isAdmin && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                        admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{user.email || "signed in"}</p>
                </div>
              </div>
              <Link href="/account" onClick={() => setMobileOpen(false)}>
                <div className="flex items-center gap-2 py-2 text-sm font-semibold text-foreground/70 hover:text-primary cursor-pointer">
                  <UserCircle className="h-4 w-4" />
                  my account
                </div>
              </Link>
              <Link href="/settings" onClick={() => setMobileOpen(false)}>
                <div className="flex items-center gap-2 py-2 text-sm font-semibold text-foreground/70 hover:text-primary cursor-pointer">
                  <Settings className="h-4 w-4" />
                  settings
                </div>
              </Link>
              {isAdmin && (
                <Link href="/admin" onClick={() => setMobileOpen(false)}>
                  <div className="flex items-center gap-2 py-2 text-sm font-semibold text-primary cursor-pointer">
                    <Crown className="h-4 w-4" />
                    admin panel
                  </div>
                </Link>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await logout();
                  window.location.href = "/";
                }}
                className="w-full gap-2 text-destructive border-destructive/30"
              >
                <LogOut className="h-4 w-4" />
                sign out
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              className="w-full bg-primary text-primary-foreground rounded-full"
              onClick={() => {
                window.location.href = getLoginUrl();
              }}
            >
              sign in
            </Button>
          )}
        </div>
      )}
    </nav>
  );
}
