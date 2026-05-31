import axios from "axios";
import type { CommunityItem, FeedPost, GameId, ScrimEvent, UserRole } from "@/types";

const baseURL = (import.meta as any).env?.VITE_API_URL ?? "http://localhost:5001/api/v1";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT from localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("bgmi_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Basic 401 handler
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401 && typeof window !== "undefined") {
      window.localStorage.removeItem("bgmi_token");
      window.localStorage.removeItem("bgmi_user");
    }
    return Promise.reject(err);
  }
);

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface AuthPayload {
  user: {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    avatar?: string;
  };
  token: string;
  profile?: unknown;
}

export interface FeedResponse {
  posts: FeedPost[];
  total?: number;
  page?: number;
  pages?: number;
  nextCursor?: string | null;
}

export interface PlayerSearchResponse {
  players: any[];
  total: number;
  page: number;
  pages: number;
}

export interface PaginatedClipResponse {
  clips: any[];
  total: number;
  page: number;
  pages: number;
}

export interface LeaderboardResponse {
  entries: any[];
  total: number;
  page: number;
  pages: number;
  metric: string;
  game: string;
}

export interface SearchResults {
  users?: any[];
  posts?: any[];
  clips?: any[];
  scrims?: any[];
  clubs?: any[];
  organizations?: any[];
}

const unwrap = <T>(promise: Promise<{ data: ApiResponse<T> }>) => promise.then((res) => res.data.data);

// ─── AUTH ─────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) => unwrap(api.post<ApiResponse<AuthPayload>>("/auth/login", { email, password })),
  register: (payload: { username: string; email: string; password: string; role: UserRole; fullName?: string; country?: string; dateOfBirth?: string }) =>
    unwrap(api.post<ApiResponse<AuthPayload>>("/auth/register", payload)),
  googleLogin: (payload: { email: string; username?: string; fullName?: string; avatar?: string }) =>
    unwrap(api.post<ApiResponse<AuthPayload>>("/auth/google-login", payload)),
  me: () => unwrap(api.get<ApiResponse<AuthPayload>>("/auth/me")),
  checkUsername: (username: string) => unwrap(api.post<ApiResponse<{ username: string; available: boolean }>>("/auth/check-username", { username })),
  completeProfile: (payload: Record<string, unknown>) => unwrap(api.put<ApiResponse<AuthPayload>>("/auth/complete-profile", payload)),
  follow: (userId: string) => unwrap(api.post<ApiResponse<null>>(`/auth/follow/${userId}`)),
  uploadAvatar: (file: File) => {
    const fd = new FormData();
    fd.append("avatar", file);
    return unwrap(api.post<ApiResponse<{ url: string }>>("/auth/avatar", fd, { headers: { "Content-Type": "multipart/form-data" } }));
  },
  uploadBanner: (file: File) => {
    const fd = new FormData();
    fd.append("banner", file);
    return unwrap(api.post<ApiResponse<{ url: string }>>("/auth/banner", fd, { headers: { "Content-Type": "multipart/form-data" } }));
  },
  updateGamePreferences: (gamePreferences: any[]) => unwrap(api.put<ApiResponse<AuthPayload>>("/auth/game-preferences", { gamePreferences })),
};

// ─── POSTS ────────────────────────────────────────────
export const postsApi = {
  feed: (params?: { game?: GameId | "all"; games?: GameId[]; cursor?: string | null; page?: number }) =>
    unwrap(
      api.get<ApiResponse<FeedResponse>>("/posts/feed", {
        params: {
          game: params?.game && params.game !== "all" ? params.game : undefined,
          games: params?.games?.length ? params.games.join(",") : undefined,
          cursor: params?.cursor || undefined,
          page: params?.page,
        },
      }),
    ),
  create: (payload: Partial<FeedPost> & { content?: string; gameTag?: GameId; postType?: string }) => unwrap(api.post<ApiResponse<FeedPost>>("/posts", payload)),
  get: (id: string) => unwrap(api.get<ApiResponse<FeedPost>>(`/posts/${id}`)),
  update: (id: string, payload: { content?: string; tags?: string[]; gameTag?: GameId }) => unwrap(api.put<ApiResponse<FeedPost>>(`/posts/${id}`, payload)),
  delete: (id: string) => unwrap(api.delete<ApiResponse<null>>(`/posts/${id}`)),
  getByUser: (userId: string, page = 1) => unwrap(api.get<ApiResponse<FeedResponse>>(`/posts/user/${userId}`, { params: { page } })),
  like: (id: string) => unwrap(api.post<ApiResponse<{ liked: boolean }>>(`/posts/${id}/like`)),
  save: (id: string) => unwrap(api.post<ApiResponse<{ saved: boolean }>>(`/posts/${id}/save`)),
  share: (id: string) => unwrap(api.post<ApiResponse<{ shares: number }>>(`/posts/${id}/share`)),
  comment: (id: string, text: string) => unwrap(api.post<ApiResponse<any[]>>(`/posts/${id}/comment`, { text })),
  deleteComment: (postId: string, commentId: string) => unwrap(api.delete<ApiResponse<any[]>>(`/posts/${postId}/comment/${commentId}`)),
  likeComment: (postId: string, commentId: string) => unwrap(api.post<ApiResponse<{ liked: boolean; likesCount: number }>>(`/posts/${postId}/comment/${commentId}/like`)),
  votePoll: (id: string, optionIndex: number) => unwrap(api.post<ApiResponse<any>>(`/posts/${id}/poll/vote`, { optionIndex })),
};

// ─── SCRIMS ───────────────────────────────────────────
export const scrimsApi = {
  list: (params?: { game?: GameId; status?: string }) => unwrap(api.get<ApiResponse<ScrimEvent[]>>("/scrims", { params })),
  get: (id: string) => unwrap(api.get<ApiResponse<ScrimEvent>>(`/scrims/${id}`)),
  my: () => unwrap(api.get<ApiResponse<ScrimEvent[]>>("/scrims/my")),
  registered: () => unwrap(api.get<ApiResponse<ScrimEvent[]>>("/scrims/registered")),
  create: (payload: Record<string, unknown>) => unwrap(api.post<ApiResponse<ScrimEvent>>("/scrims", payload)),
  update: (id: string, payload: Record<string, unknown>) => unwrap(api.put<ApiResponse<ScrimEvent>>(`/scrims/${id}`, payload)),
  delete: (id: string) => unwrap(api.delete<ApiResponse<null>>(`/scrims/${id}`)),
  register: (id: string, payload?: { teamName?: string; players?: string[] }) => unwrap(api.post<ApiResponse<ScrimEvent>>(`/scrims/${id}/register`, payload || {})),
  updateRegistration: (scrimId: string, regId: string, status: string) => unwrap(api.put<ApiResponse<ScrimEvent>>(`/scrims/${scrimId}/registrations/${regId}`, { status })),
  submitResults: (id: string, results: any[]) => unwrap(api.post<ApiResponse<ScrimEvent>>(`/scrims/${id}/results`, { results })),
  analytics: (id: string) => unwrap(api.get<ApiResponse<any>>(`/scrims/${id}/analytics`)),
};

// ─── COMMUNITY ────────────────────────────────────────
export const communityApi = {
  listings: (params?: { game?: GameId; type?: string; page?: number }) =>
    unwrap(api.get<ApiResponse<{ items: CommunityItem[]; total: number }>>("/community", { params })),
  get: (id: string) => unwrap(api.get<ApiResponse<CommunityItem>>(`/community/${id}`)),
  create: (payload: Record<string, unknown>) => unwrap(api.post<ApiResponse<CommunityItem>>("/community", payload)),
  update: (id: string, payload: Record<string, unknown>) => unwrap(api.put<ApiResponse<CommunityItem>>(`/community/${id}`, payload)),
  delete: (id: string) => unwrap(api.delete<ApiResponse<null>>(`/community/${id}`)),
  join: (id: string) => unwrap(api.post<ApiResponse<CommunityItem>>(`/community/${id}/join`)),
  leave: (id: string) => unwrap(api.post<ApiResponse<CommunityItem>>(`/community/${id}/leave`)),
};

// ─── CLUBS ────────────────────────────────────────────
export const clubsApi = {
  list: (params?: { game?: GameId; q?: string }) => unwrap(api.get<ApiResponse<any[]>>("/clubs", { params })),
  get: (id: string) => unwrap(api.get<ApiResponse<any>>(`/clubs/${id}`)),
  create: (payload: Record<string, unknown>) => unwrap(api.post<ApiResponse<any>>("/clubs", payload)),
  update: (id: string, payload: Record<string, unknown>) => unwrap(api.put<ApiResponse<any>>(`/clubs/${id}`, payload)),
  delete: (id: string) => unwrap(api.delete<ApiResponse<null>>(`/clubs/${id}`)),
  join: (id: string) => unwrap(api.post<ApiResponse<any>>(`/clubs/${id}/join`)),
  leave: (id: string) => unwrap(api.post<ApiResponse<any>>(`/clubs/${id}/leave`)),
  members: (id: string) => unwrap(api.get<ApiResponse<any[]>>(`/clubs/${id}/members`)),
  createEvent: (clubId: string, payload: Record<string, unknown>) => unwrap(api.post<ApiResponse<any>>(`/clubs/${clubId}/events`, payload)),
  updateEvent: (clubId: string, eventId: string, payload: Record<string, unknown>) => unwrap(api.put<ApiResponse<any>>(`/clubs/${clubId}/events/${eventId}`, payload)),
  deleteEvent: (clubId: string, eventId: string) => unwrap(api.delete<ApiResponse<any>>(`/clubs/${clubId}/events/${eventId}`)),
  toggleAttend: (clubId: string, eventId: string) => unwrap(api.post<ApiResponse<any>>(`/clubs/${clubId}/events/${eventId}/attend`)),
  createPost: (clubId: string, payload: Record<string, unknown>) => unwrap(api.post<ApiResponse<any>>(`/clubs/${clubId}/posts`, payload)),
  getPosts: (clubId: string) => unwrap(api.get<ApiResponse<any[]>>(`/clubs/${clubId}/posts`)),
};

// ─── CLIPS ────────────────────────────────────────────
export const clipsApi = {
  list: (params?: { game?: GameId; sort?: string; page?: number }) =>
    unwrap(api.get<ApiResponse<PaginatedClipResponse>>("/clips", { params })),
  get: (clipId: string) => unwrap(api.get<ApiResponse<any>>(`/clips/${clipId}`)),
  getByUser: (userId: string) => unwrap(api.get<ApiResponse<any[]>>(`/clips/user/${userId}`)),
  upload: (formData: FormData) =>
    unwrap(api.post<ApiResponse<any>>("/clips", formData, { headers: { "Content-Type": "multipart/form-data" } })),
  update: (clipId: string, payload: { title?: string; description?: string; tags?: string[]; game?: GameId }) =>
    unwrap(api.put<ApiResponse<any>>(`/clips/${clipId}`, payload)),
  delete: (clipId: string) => unwrap(api.delete<ApiResponse<null>>(`/clips/${clipId}`)),
  like: (clipId: string) => unwrap(api.post<ApiResponse<{ liked: boolean }>>(`/clips/${clipId}/like`)),
  comment: (clipId: string, text: string) => unwrap(api.post<ApiResponse<any[]>>(`/clips/${clipId}/comment`, { text })),
  deleteComment: (clipId: string, commentId: string) => unwrap(api.delete<ApiResponse<any[]>>(`/clips/${clipId}/comment/${commentId}`)),
};

// ─── ACHIEVEMENTS ─────────────────────────────────────
export const achievementsApi = {
  getByUser: (userId: string) => unwrap(api.get<ApiResponse<any[]>>(`/achievements/${userId}`)),
  add: (formData: FormData) =>
    unwrap(api.post<ApiResponse<any>>("/achievements", formData, { headers: { "Content-Type": "multipart/form-data" } })),
  delete: (achievementId: string) => unwrap(api.delete<ApiResponse<null>>(`/achievements/${achievementId}`)),
};

// ─── SCOUTING ─────────────────────────────────────────
export const scoutingApi = {
  players: (params?: Record<string, unknown>) => unwrap(api.get<ApiResponse<PlayerSearchResponse>>("/scouting/players", { params })),
  save: (playerId: string) => unwrap(api.post<ApiResponse<{ saved: boolean }>>(`/scouting/save/${playerId}`)),
  saved: () => unwrap(api.get<ApiResponse<any[]>>("/scouting/saved")),
  note: (playerId: string, notes: string) => unwrap(api.put<ApiResponse<any[]>>(`/scouting/note/${playerId}`, { notes })),
  invite: (playerId: string, message?: string) => unwrap(api.post<ApiResponse<any>>(`/scouting/invite/${playerId}`, { message })),
};

// ─── PROFILE ──────────────────────────────────────────
export const profileApi = {
  get: (usernameOrId: string) => unwrap(api.get<ApiResponse<any>>(`/profile/${usernameOrId}`)),
  search: (params?: Record<string, unknown>) => unwrap(api.get<ApiResponse<PlayerSearchResponse>>("/profile/search", { params })),
  top: (params?: { game?: GameId; limit?: number }) => unwrap(api.get<ApiResponse<any[]>>("/profile/top", { params })),
  trackView: (userId: string) => unwrap(api.post<ApiResponse<null>>(`/profile/${userId}/view`)),
  update: (payload: Record<string, unknown>) => unwrap(api.put<ApiResponse<any>>("/profile", payload)),
  create: (payload: Record<string, unknown>) => unwrap(api.post<ApiResponse<any>>("/profile", payload)),
};

// ─── NOTIFICATIONS ────────────────────────────────────
export const notificationsApi = {
  list: (params?: { unreadOnly?: boolean; limit?: number }) =>
    unwrap(api.get<ApiResponse<any[]>>("/notifications", { params: { unreadOnly: params?.unreadOnly, limit: params?.limit } })),
  unreadCount: () => unwrap(api.get<ApiResponse<{ count: number }>>("/notifications/unread-count")),
  markRead: (id: string) => unwrap(api.patch<ApiResponse<any>>(`/notifications/${id}/read`)),
  readAll: () => unwrap(api.patch<ApiResponse<null>>("/notifications/read-all")),
  delete: (id: string) => unwrap(api.delete<ApiResponse<null>>(`/notifications/${id}`)),
};

// ─── ORGANIZATIONS ────────────────────────────────────
export const organizationsApi = {
  get: (orgId: string) => unwrap(api.get<ApiResponse<any>>(`/organizations/${orgId}`)),
  create: (formData: FormData) => unwrap(api.post<ApiResponse<any>>("/organizations", formData, { headers: { "Content-Type": "multipart/form-data" } })),
  update: (formData: FormData) => unwrap(api.put<ApiResponse<any>>("/organizations", formData, { headers: { "Content-Type": "multipart/form-data" } })),
  dashboard: (params?: { page?: number }) => unwrap(api.get<ApiResponse<any>>("/organizations/dashboard/players", { params })),
  scouting: (params?: Record<string, unknown>) => unwrap(api.get<ApiResponse<PlayerSearchResponse>>("/organizations/scouting", { params })),
  savePlayer: (playerId: string, notes?: string) => unwrap(api.post<ApiResponse<null>>(`/organizations/save-player/${playerId}`, { notes })),
  savedPlayers: () => unwrap(api.get<ApiResponse<any[]>>("/organizations/saved-players")),
};

// ─── GAMES ────────────────────────────────────────────
export const gamesApi = {
  list: () => unwrap(api.get<ApiResponse<any[]>>("/games")),
  get: (gameId: string) => unwrap(api.get<ApiResponse<any>>(`/games/${gameId}`)),
};

// ─── LEADERBOARD ──────────────────────────────────────
export const leaderboardApi = {
  get: (params?: { game?: GameId; metric?: string; period?: string; page?: number; limit?: number }) =>
    unwrap(api.get<ApiResponse<LeaderboardResponse>>("/leaderboard", { params })),
  scrims: (params?: { game?: GameId; limit?: number }) =>
    unwrap(api.get<ApiResponse<any[]>>("/leaderboard/scrims", { params })),
};

// ─── SEARCH ───────────────────────────────────────────
export const searchApi = {
  global: (q: string, type = "all", page = 1) =>
    unwrap(api.get<ApiResponse<SearchResults>>("/search", { params: { q, type, page } })),
};
