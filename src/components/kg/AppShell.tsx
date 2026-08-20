import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import {
  Bell,
  Bug,
  ChartBar,
  CloudSun,
  Droplets,
  Home,
  LogOut,
  MapPin,
  Menu,
  Plane,
  Radio,
  Settings,
  Sprout,
  Bot,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { useSensors } from "@/lib/sensors/SensorProvider";
import { buildAlerts } from "@/lib/ai/engine";
import { Brand } from "./Brand";
import { ModeBadge } from "./ModeBadge";
import { LanguageToggle } from "./LanguageToggle";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/monitoring", label: "Farm Monitoring", icon: Sprout },
  { to: "/sensors", label: "Sensors", icon: Radio },
  { to: "/insights", label: "AI Insights", icon: Bot },
  { to: "/irrigation", label: "Irrigation", icon: Droplets },
  { to: "/crop-health", label: "Crop Health", icon: Bug },
  { to: "/weather", label: "Weather", icon: CloudSun },
  { to: "/drone", label: "Drone Monitoring", icon: Plane },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/reports", label: "Reports", icon: ChartBar },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const { data: profile } = useProfile();
  const { reading } = useSensors();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const issues = buildAlerts(reading).filter((a) => a.severity !== "healthy").length;

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const nav = (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-forest text-white shadow-sm" : "text-forest/75 hover:bg-mint",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-cream">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-forest/10 bg-white/80 p-4 backdrop-blur lg:flex">
        <Brand className="px-1 pb-5" />
        {nav}
        <div className="mt-auto rounded-xl kg-soft-gradient p-3 text-xs text-agri">
          <p className="font-semibold">Sensor-ready architecture</p>
          <p className="mt-1 text-earth">Connect ESP32, Raspberry Pi or BLE nodes any time — no redesign needed.</p>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close menu" className="absolute inset-0 bg-forest/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between pb-5">
              <Brand />
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="rounded-lg p-1 text-forest hover:bg-mint">
                <X className="size-5" />
              </button>
            </div>
            {nav}
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-forest/10 bg-cream/85 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <button
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="rounded-lg p-2 text-forest hover:bg-mint lg:hidden"
            >
              <Menu className="size-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-display text-lg font-semibold text-forest">{title}</h1>
              {subtitle && <p className="truncate text-xs text-earth">{subtitle}</p>}
            </div>
            <LanguageToggle />
            <ModeBadge className="hidden md:inline-flex" />
            <span className="hidden items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] text-earth shadow-sm md:inline-flex">
              <MapPin className="size-3" />
              {profile?.village || profile?.district || "Field location"}
            </span>
            <Link to="/alerts" className="relative rounded-lg p-2 text-forest hover:bg-mint" aria-label="Alerts">
              <Bell className="size-5" />
              {issues > 0 && (
                <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-danger text-[9px] font-bold text-white">
                  {issues}
                </span>
              )}
            </Link>
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full bg-white py-1 pl-1 pr-3 shadow-sm"
              >
                <span className="grid size-8 place-items-center rounded-full kg-gradient text-xs font-semibold text-white">
                  {(profile?.full_name || "F").slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden text-left leading-tight sm:block">
                  <span className="block text-xs font-semibold text-forest">{profile?.full_name || "Farmer"}</span>
                  <span className="block text-[10px] text-earth">{profile?.farm_name || "My Farm"}</span>
                </span>
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-forest/10 bg-white p-1 shadow-lg"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  {[
                    { to: "/settings", label: "My Profile" },
                    { to: "/monitoring", label: "My Farm" },
                    { to: "/sensors", label: "Sensor Devices" },
                    { to: "/settings", label: "Settings" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-forest hover:bg-mint"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={signOut}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-danger hover:bg-danger/10"
                  >
                    <LogOut className="size-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="px-4 pb-24 pt-5 sm:px-6 lg:pb-10">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-forest/10 bg-white/95 px-2 py-1.5 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          {NAV.slice(0, 5).map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[10px] font-medium",
                pathname === to ? "text-agri" : "text-forest/55",
              )}
            >
              <Icon className="size-5" />
              {label.split(" ")[0]}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}