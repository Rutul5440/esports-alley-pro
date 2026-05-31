import { Navbar } from "./Navbar";
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Trophy } from "lucide-react";

export function AppShell({ children, hideFooter = false }: { children: ReactNode; hideFooter?: boolean }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      {!hideFooter && (
        <footer className="border-t border-border bg-card/50">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-gold shadow-gold">
                    <Trophy size={14} className="text-primary-foreground" />
                  </span>
                  <span className="font-display text-lg font-bold">Conq<span className="text-gradient-gold">Link</span></span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">The professional network for esports players. Build your profile, showcase your skills, get scouted.</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Platform</h3>
                <div className="mt-3 grid gap-2 text-sm">
                  <Link to="/explore" className="text-muted-foreground hover:text-foreground transition-colors">Explore Players</Link>
                  <Link to="/scrims" className="text-muted-foreground hover:text-foreground transition-colors">Scrims & Tournaments</Link>
                  <Link to="/community" className="text-muted-foreground hover:text-foreground transition-colors">Community</Link>
                  <Link to="/clips" className="text-muted-foreground hover:text-foreground transition-colors">Clips</Link>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Games</h3>
                <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                  <span>BGMI</span><span>Valorant</span><span>CS2</span><span>Free Fire</span><span>Apex Legends</span>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</h3>
                <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                  <span>About</span><span>Careers</span><span>Privacy Policy</span><span>Terms of Service</span>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
              © {new Date().getFullYear()} ConqLink — The esports professional network. All rights reserved.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
