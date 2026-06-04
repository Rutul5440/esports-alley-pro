import { Play, Heart, Eye } from "lucide-react";
import { useState } from "react";
import type { Clip } from "@/types";

export function VideoPlayer({ clip }: { clip: Clip }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="bg-gradient-surface border border-border rounded-xl overflow-hidden group">
      <div className="relative aspect-video bg-background">
        {playing && clip.url ? (
          <video src={clip.url} controls autoPlay className="w-full h-full object-cover" />
        ) : (
          <>
            <img
              src={clip.thumbnail}
              alt={clip.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center bg-background/30 hover:bg-background/10 transition-colors"
              aria-label="Play clip"
            >
              <span className="w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform">
                <Play size={26} className="text-primary-foreground ml-1" fill="currentColor" />
              </span>
            </button>
          </>
        )}
      </div>
      <div className="p-4">
        <h4 className="font-display font-semibold text-foreground line-clamp-1">{clip.title}</h4>
        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Eye size={12} />
            {clip.views.toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-1">
            <Heart size={12} />
            {clip.likes.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
