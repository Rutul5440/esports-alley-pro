import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent, type DragEvent } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { clipsApi } from "@/lib/api";
import { games } from "@/lib/mock-data";
import { UploadCloud, Film, X, Loader2, CheckCircle2, Tag } from "lucide-react";
import type { GameId } from "@/types";

export const Route = createFileRoute("/_authenticated/upload")({
  head: () => ({ meta: [{ title: "Upload clip — ConqLink" }] }),
  component: UploadClip,
});

function UploadClip() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [game, setGame] = useState<GameId>("bgmi");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const onDrop = (e: DragEvent) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("video/")) setFile(f);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;
    setUploading(true);
    setError("");
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append("clip", file);
      formData.append("title", title);
      formData.append("description", desc);
      formData.append("game", game);
      if (tags) formData.append("tags", tags);
      if (thumbnail) formData.append("thumbnail", thumbnail);

      // Simulate progress while uploading
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 15, 90));
      }, 500);

      await clipsApi.upload(formData);

      clearInterval(progressInterval);
      setProgress(100);
      setUploading(false);
      setDone(true);
      setTimeout(() => navigate({ to: "/clips" }), 1500);
    } catch (err: any) {
      setUploading(false);
      setProgress(0);
      setError(err?.response?.data?.message || "Upload failed. Please try again.");
    }
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-display font-bold">Upload a clip</h1>
        <p className="text-muted-foreground mt-1">Showcase your best plays. MP4, MOV up to 100MB.</p>

        <form onSubmit={submit} className="mt-8 space-y-6">
          {/* Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
              drag ? "border-primary bg-primary/5" : "border-border bg-gradient-surface"
            }`}
          >
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <Film className="text-primary" size={24} />
                <div className="text-left">
                  <div className="font-semibold">{file.name}</div>
                  <div className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</div>
                </div>
                <button type="button" onClick={() => setFile(null)} className="ml-2 p-1 hover:bg-accent/40 rounded">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <UploadCloud className="mx-auto text-muted-foreground" size={36} />
                <p className="mt-3 font-medium">Drop your clip here</p>
                <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </>
            )}
          </div>

          {/* Progress bar */}
          {uploading && (
            <div className="space-y-2">
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-gradient-gold transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-muted-foreground text-center">Uploading... {progress}%</p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Clip title</span>
              <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="4K clutch on Erangel"
                className="mt-1.5 w-full px-3 py-2.5 rounded-md bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Game</span>
              <select value={game} onChange={(e) => setGame(e.target.value as GameId)}
                className="mt-1.5 w-full px-3 py-2.5 rounded-md bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30">
                {games.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description (optional)</span>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3}
              className="mt-1.5 w-full px-3 py-2.5 rounded-md bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Tag size={12} /> Tags (comma separated)</span>
              <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="clutch, snipe, ranked"
                className="mt-1.5 w-full px-3 py-2.5 rounded-md bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Thumbnail (optional)</span>
              <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
                className="mt-1.5 w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/20" />
            </label>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
          )}

          <button
            type="submit"
            disabled={!file || !title || uploading || done}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-gradient-gold text-primary-foreground font-semibold shadow-gold disabled:opacity-60"
          >
            {uploading && <Loader2 size={16} className="animate-spin" />}
            {done && <CheckCircle2 size={16} />}
            {done ? "Uploaded!" : uploading ? "Uploading…" : "Publish clip"}
          </button>
        </form>
      </div>
    </AppShell>
  );
}
