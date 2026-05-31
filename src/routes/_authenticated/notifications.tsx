import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { notificationsApi } from "@/lib/api";
import type { Notification, NotificationType } from "@/types";
import { Bell, CheckCheck, Heart, MessageCircle, Sword, UserPlus, Trophy, Trash2, Loader2, Shield } from "lucide-react";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({ meta: [{ title: "Notifications - ConqLink" }] }),
  component: Notifications,
});

const filters: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "follow", label: "Follows" },
  { id: "like", label: "Likes" },
  { id: "comment", label: "Comments" },
  { id: "scrim_invite", label: "Scrim Invites" },
  { id: "recruitment", label: "Recruitment" },
];

const typeIcons: Record<string, typeof Bell> = {
  follow: UserPlus,
  like: Heart,
  comment: MessageCircle,
  scrim_invite: Sword,
  recruitment: Trophy,
  club_invite: Shield,
  achievement: Trophy,
  scrim_result: Sword,
  mention: MessageCircle,
};

function Notifications() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");

  const notifQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationsApi.list(),
  });

  const markAllRead = useMutation({
    mutationFn: notificationsApi.readAll,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markRead = useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const deleteNotif = useMutation({
    mutationFn: (id: string) => notificationsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const notifications: Notification[] = notifQuery.data || [];
  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.isRead;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Notifications</h1>
            <p className="text-muted-foreground mt-1">{unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={() => markAllRead.mutate()} disabled={markAllRead.isPending}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:border-primary/50">
              {markAllRead.isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCheck size={14} />}
              Mark all read
            </button>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`rounded-md border px-3 py-1.5 text-sm ${filter === f.id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          {notifQuery.isLoading ? (
            <div className="py-10 text-center text-muted-foreground">
              <Loader2 size={20} className="inline animate-spin mr-2" /> Loading...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Bell size={36} className="mx-auto text-muted-foreground/40" />
              <p className="mt-3 text-muted-foreground">No notifications{filter !== "all" ? ` matching "${filter}"` : ""}.</p>
            </div>
          ) : (
            filtered.map((notif) => {
              const Icon = typeIcons[notif.type] || Bell;
              return (
                <div key={notif._id} className={`flex items-start gap-3 rounded-lg border p-4 transition-colors ${notif.isRead ? "border-border bg-card" : "border-primary/30 bg-primary/5"}`}>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full ${notif.isRead ? "bg-muted" : "bg-primary/10"}`}>
                    <Icon size={16} className={notif.isRead ? "text-muted-foreground" : "text-primary"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{notif.message}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatTime(notif.createdAt)}</span>
                      {notif.sender && <span>from @{notif.sender.username}</span>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {!notif.isRead && (
                      <button onClick={() => markRead.mutate(notif._id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent/30 hover:text-foreground" title="Mark read">
                        <CheckCheck size={14} />
                      </button>
                    )}
                    <button onClick={() => deleteNotif.mutate(notif._id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AppShell>
  );
}

function formatTime(value: string) {
  const d = new Date(value);
  const now = Date.now();
  const diff = now - d.getTime();
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
