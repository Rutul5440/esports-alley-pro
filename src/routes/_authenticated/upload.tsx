import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent, type DragEvent } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { UploadCloud, Film, X, Loader2, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/upload")({
  head: () => ({ meta: [{ title: "Upload clip — ConqLink" }] }),
  component: UploadClip,
});

function UploadClip() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  const onDrop = (e: DragEvent) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("video/")) setFile(f);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;
    setUploading(true);
    // Replace with: api.post('/clips', formData, { headers: 'multipart/form-data' })
    await new Promise((r) => setTimeout(r, 1500));
    setUploading(false); setDone(true);
    setTimeout(() => navigate({ to: "/dashboard" }), 1200);
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

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Clip title</span>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="4K clutch on Erangel"
              className="mt-1.5 w-full px-3 py-2.5 rounded-md bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description (optional)</span>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              className="mt-1.5 w-full px-3 py-2.5 rounded-md bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </label>

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
