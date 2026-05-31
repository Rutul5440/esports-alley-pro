import { SearchX } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <section className="rounded-lg border border-border bg-card p-8 text-center">
      <SearchX className="mx-auto text-muted-foreground" size={28} />
      <h2 className="mt-3 font-display text-lg font-bold">{title}</h2>
      {description && <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>}
    </section>
  );
}
