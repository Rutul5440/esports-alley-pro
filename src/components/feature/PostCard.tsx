import { BadgeCheck, Bookmark, Heart, MessageCircle, Repeat2, Send, Loader2, ChevronDown, Trash2, MoreVertical, Edit, X, Check } from "lucide-react";
import type { CommentItem, FeedPost } from "@/types";
import { gameName } from "@/lib/mock-data";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postsApi } from "@/lib/api";
import { cn } from "@/lib/utils";

export function PostCard({ post, onLike, onSave, onShare }: { post: FeedPost; onLike?: () => void; onSave?: () => void; onShare?: () => void }) {
  const game = post.gameTag || post.game;
  const body = post.content || post.body;
  const media = post.mediaUrls?.[0] || post.image;
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  
  // Post Edit and Menu States
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(body || "");
  const [showMenu, setShowMenu] = useState(false);

  const postId = post.id || post._id!;

  const addComment = useMutation({
    mutationFn: () => postsApi.comment(postId, commentText),
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });

  const deleteComment = useMutation({
    mutationFn: (commentId: string) => postsApi.deleteComment(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });

  const toggleCommentLike = useMutation({
    mutationFn: (commentId: string) => postsApi.likeComment(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });

  const updatePost = useMutation({
    mutationFn: () => postsApi.update(postId, { content: editContent }),
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });

  const deletePost = useMutation({
    mutationFn: () => postsApi.delete(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });

  const comments: CommentItem[] = post.commentsList || [];

  return (
    <article className="rounded-lg border border-border bg-card overflow-hidden transition-shadow hover:shadow-elevated/30 relative">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <img src={post.authorAvatar || `https://api.dicebear.com/9.x/initials/svg?seed=${post.authorName}`} alt="" className="h-11 w-11 rounded-full border border-border object-cover" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold">{post.authorName}</span>
              {post.authorType === "organization" && <BadgeCheck size={15} className="text-primary" />}
              <span className="rounded-md border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-primary">
                {gameName(game)}
              </span>
              {post.postType && post.postType !== "general" && (
                <span className="rounded-md bg-accent/40 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {post.postType.replace("_", " ")}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">@{post.authorHandle} · {post.authorMeta} · {formatDate(post.createdAt)}</p>
          </div>

          {/* Top-Right Three Dot Menu */}
          {(post.authorId === user?.id || user?.role === "admin") && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-accent/45 hover:text-foreground transition-colors cursor-pointer"
              >
                <MoreVertical size={16} />
              </button>
              
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-8 z-20 w-36 rounded-md border border-border bg-card p-1 shadow-elevated">
                    <button
                      type="button"
                      onClick={() => { setIsEditing(true); setShowMenu(false); }}
                      className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-xs font-semibold hover:bg-accent/40 text-foreground cursor-pointer transition-colors"
                    >
                      <Edit size={13} className="text-primary" /> Edit Post
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this post?")) {
                          deletePost.mutate();
                        }
                        setShowMenu(false);
                      }}
                      className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-xs font-semibold hover:bg-destructive/10 text-destructive cursor-pointer transition-colors"
                    >
                      <Trash2 size={13} /> Delete Post
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Inline Editor or Render Text */}
        {isEditing ? (
          <div className="mt-4 space-y-2.5">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setIsEditing(false); setEditContent(body || ""); }}
                className="rounded-md border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-accent/30 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updatePost.isPending || !editContent.trim()}
                onClick={() => updatePost.mutate()}
                className="rounded-md bg-gradient-gold px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-gold disabled:opacity-40 cursor-pointer"
              >
                {updatePost.isPending ? <Loader2 size={12} className="animate-spin" /> : "Save"}
              </button>
            </div>
          </div>
        ) : (
          body && <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-foreground/90">{body}</p>
        )}

        {/* Tags */}
        {!!post.tags?.length && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-md bg-accent/30 px-2 py-1 text-xs text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Poll */}
        {post.poll && (
          <div className="mt-4 rounded-md border border-border bg-background/50 p-4">
            <p className="font-semibold text-sm mb-3">{post.poll.question}</p>
            <div className="space-y-2">
              {post.poll.options.map((opt, idx) => {
                const pct = post.poll!.totalVotes > 0 ? Math.round((opt.votes / post.poll!.totalVotes) * 100) : 0;
                const isMyVote = post.poll!.myVote === idx;
                return (
                  <div key={idx} className="relative overflow-hidden rounded-md border border-border p-2.5 text-sm">
                    <div className={`absolute inset-y-0 left-0 ${isMyVote ? "bg-primary/15" : "bg-accent/30"}`} style={{ width: `${pct}%` }} />
                    <div className="relative flex items-center justify-between">
                      <span className={isMyVote ? "font-semibold text-primary" : ""}>{opt.text}</span>
                      <span className="text-xs text-muted-foreground">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{post.poll.totalVotes} votes</p>
          </div>
        )}
      </div>

      {media && <img src={media} alt="" className="aspect-[16/7] w-full object-cover" loading="lazy" />}

      <div className="grid grid-cols-5 border-t border-border px-2 py-1 text-sm text-muted-foreground">
        <Action icon={Heart} label={String(post.likes || 0)} active={post.likedByMe} onClick={onLike} />
        <Action icon={MessageCircle} label={String(post.comments || 0)} onClick={() => setShowComments(!showComments)} />
        <Action icon={Repeat2} label={String(post.shares ?? post.reposts ?? 0)} onClick={onShare} />
        <Action icon={Bookmark} label={post.savedByMe ? "Saved" : "Save"} active={post.savedByMe} onClick={onSave} />
        <Action icon={Send} label="Share" onClick={onShare} />
      </div>

      {/* Inline Comment Section */}
      {showComments && (
        <div className="border-t border-border bg-background/30 p-4">
          {/* Comment input */}
          <div className="flex gap-2">
            <img
              src={`https://api.dicebear.com/9.x/initials/svg?seed=${user?.username || "me"}`}
              alt=""
              className="h-8 w-8 rounded-full"
            />
            <div className="flex flex-1 gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && commentText.trim()) addComment.mutate(); }}
                placeholder="Write a comment…"
                className="flex-1 rounded-md border border-border bg-input px-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                disabled={!commentText.trim() || addComment.isPending}
                onClick={() => addComment.mutate()}
                className="rounded-md bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary disabled:opacity-40 cursor-pointer transition-colors"
              >
                {addComment.isPending ? <Loader2 size={14} className="animate-spin" /> : "Post"}
              </button>
            </div>
          </div>

          {/* Existing comments */}
          {comments.length > 0 && (
            <div className="mt-4 space-y-3">
              {comments.slice(0, 5).map((c) => {
                const hasLiked = c.likes?.some((id) => String(id) === String(user?.id || user?._id)) || false;
                return (
                  <div key={c._id} className="flex items-start gap-2 group">
                    <img
                      src={c.user?.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${c.user?.username || "u"}`}
                      alt=""
                      className="h-7 w-7 rounded-full border border-border object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {c.user?.username ? `@${c.user.username}` : "@gamer"}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{formatDate(c.createdAt)}</span>
                      </div>
                      <p className="text-sm text-foreground/90 mt-0.5">{c.text}</p>
                    </div>

                    {/* Action container for comments */}
                    <div className="flex items-center gap-1 self-center shrink-0">
                      {/* Heart Option for all users comment */}
                      <button
                        onClick={() => toggleCommentLike.mutate(c._id)}
                        disabled={toggleCommentLike.isPending}
                        className={cn(
                          "rounded p-1 transition-all duration-200 flex items-center gap-1 cursor-pointer",
                          hasLiked
                            ? "text-primary bg-primary/5 scale-105"
                            : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                        )}
                      >
                        <Heart size={12} fill={hasLiked ? "currentColor" : "none"} className={hasLiked ? "scale-105" : ""} />
                        {c.likes?.length > 0 && <span className="text-[10px] font-mono leading-none">{c.likes.length}</span>}
                      </button>

                      {/* Trash Delete Option */}
                      {(c.user?._id === user?.id || post.authorId === user?.id || user?.role === "admin") && (
                        <button
                          onClick={() => deleteComment.mutate(c._id)}
                          className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {comments.length > 5 && (
                <button className="flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer">
                  <ChevronDown size={14} /> View {comments.length - 5} more comments
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function Action({ icon: Icon, label, active, onClick }: { icon: typeof Heart; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`inline-flex items-center justify-center gap-2 rounded-md px-2 py-2 transition-colors hover:bg-accent/30 hover:text-foreground cursor-pointer ${active ? "text-primary" : ""}`}>
      <Icon size={16} /> <span className="truncate">{label}</span>
    </button>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const now = Date.now();
  const diff = now - date.getTime();
  if (diff < 60000) return "now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
