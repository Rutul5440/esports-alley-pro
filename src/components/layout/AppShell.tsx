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
        <footer className="border-t border-white/5 bg-card/20 backdrop-blur-md shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-gold shadow-gold">
                    <Trophy size={16} className="text-primary-foreground" />
                  </span>
                  <span className="font-display text-lg font-bold">Conq<span className="text-gradient-gold">Link</span></span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground/80">
                  The professional career hub and scouting matrix for esports players. Build your digital card, showcase elite verified stats, and get signed by leading organizations.
                </p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gold font-display">Platform Matrix</h3>
                <div className="mt-4 grid gap-2.5 text-sm">
                  <Link to="/explore" className="text-muted-foreground hover:text-gold transition-colors inline-flex items-center">Explore Players</Link>
                  <Link to="/scrims" className="text-muted-foreground hover:text-gold transition-colors inline-flex items-center">Scrims & Tournaments</Link>
                  <Link to="/community" className="text-muted-foreground hover:text-gold transition-colors inline-flex items-center">Community Matrix</Link>
                  <Link to="/clips" className="text-muted-foreground hover:text-gold transition-colors inline-flex items-center">Clips Showcase</Link>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gold font-display">Supported Arenas</h3>
                <div className="mt-4 grid gap-2 text-sm text-muted-foreground/80 font-medium">
                  <span className="hover:text-foreground transition-colors">Battlegrounds Mobile India (BGMI)</span>
                  <span className="hover:text-foreground transition-colors">Valorant Champions</span>
                  <span className="hover:text-foreground transition-colors">Counter-Strike 2 (CS2)</span>
                  <span className="hover:text-foreground transition-colors">Free Fire Max</span>
                  <span className="hover:text-foreground transition-colors">Apex Legends Mobile</span>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gold font-display">Operations</h3>
                <div className="mt-4 grid gap-2.5 text-sm text-muted-foreground/80 font-medium">
                  <span className="hover:text-foreground transition-colors cursor-pointer">About Network</span>
                  <span className="hover:text-foreground transition-colors cursor-pointer">Careers / Scrim Scouts</span>
                  <span className="hover:text-foreground transition-colors cursor-pointer">Privacy Protocol</span>
                  <span className="hover:text-foreground transition-colors cursor-pointer">Terms of Engagement</span>
                </div>
              </div>
            </div>
            <div className="mt-12 border-t border-white/5 pt-8 text-center text-xs text-muted-foreground/50">
              © {new Date().getFullYear()} ConqLink. Powered by Esports Alley. Crafted for professional esports ecosystems.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
