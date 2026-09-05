"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  LogOut,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type NavItem = { href: string; label: string; icon: React.ReactNode };

export function AppShell({
  items,
  title,
  children,
  userName,
  roleLabel,
  impersonating,
}: {
  items: NavItem[];
  title: string;
  children: React.ReactNode;
  userName: string;
  roleLabel: string;
  impersonating?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  }

  const nav = (
    <nav className="flex flex-col gap-1 p-3">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-sidebar-accent text-white"
                : "text-sidebar-foreground/80 hover:bg-white/10 hover:text-white",
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      {impersonating ? (
        <div className="bg-amber-500 px-4 py-2 text-center text-sm font-medium text-amber-950">
          আপনি সুপার অ্যাডমিন হিসেবে এই স্কুলে লগইন করেছেন।{" "}
          <form action="/api/auth/exit-impersonation" method="post" className="inline">
            <button className="underline">ফিরে যান</button>
          </form>
        </div>
      ) : null}
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
          <div className="flex h-16 items-center px-4">
            <Brand href={items[0]?.href || "/"} className="text-white" />
          </div>
          <p className="px-6 pb-2 text-xs uppercase tracking-wider text-white/50">{title}</p>
          <div className="flex-1 overflow-y-auto">{nav}</div>
        </aside>

        {open ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
            <aside className="relative h-full w-72 bg-sidebar text-sidebar-foreground">
              <div className="flex h-16 items-center justify-between px-4">
                <Brand href={items[0]?.href || "/"} className="text-white" />
                <button onClick={() => setOpen(false)} className="text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {nav}
            </aside>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/90 px-4 backdrop-blur">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{roleLabel}</p>
              <p className="text-sm font-medium">{userName}</p>
            </div>
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 hover:bg-muted"
              aria-label="থিম"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Bell className="h-4 w-4 text-muted-foreground" />
            <form action="/api/auth/logout" method="post">
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4" />
                লগআউট
              </Button>
            </form>
          </header>
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
