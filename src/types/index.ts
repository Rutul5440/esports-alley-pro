export type Rank =
  | "Bronze" | "Silver" | "Gold" | "Platinum"
  | "Diamond" | "Crown" | "Ace" | "Conqueror";

export type PlayerRole = "IGL" | "Assaulter" | "Support" | "Sniper" | "Filter" | "Scout";
export type UserRole = "player" | "organization" | "admin";
export type GameId = "bgmi" | "valorant" | "cs2" | "free-fire" | "apex-legends" | "pubg-ns";
export type PostAuthorType = "player" | "organization";
export type CommunityItemType = "watch-party" | "creator-collab" | "team-up";
export type ScrimKind = "scrim" | "tournament";
export type ScrimLevel = "Rookie" | "Contender" | "Elite" | "Master" | "Conqueror";
export type PostType = "general" | "recruitment" | "achievement" | "scrim_announcement" | "clip";
export type NotificationType = "follow" | "like" | "comment" | "scrim_invite" | "recruitment" | "club_invite" | "achievement" | "scrim_result" | "mention";

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  token: string;
  avatar?: string;
  bio?: string;
  profileCompleted?: boolean;
}

export interface Game {
  id: GameId;
  name: string;
  shortName: string;
  icon?: string;
  rankSystem?: string[];
  roles?: string[];
}

export interface PlayerStats {
  matches: number;
  wins: number;
  kills: number;
  kd: number;
  avgDamage: number;
  headshotPct: number;
}

export interface Achievement {
  id: string;
  _id?: string;
  title: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  badge?: string;
  earnedAt: string;
  proofImage?: string;
}

export interface Clip {
  id: string;
  _id?: string;
  title: string;
  url: string;
  videoUrl?: string;
  thumbnail: string;
  thumbnailUrl?: string;
  views: number;
  likes: number;
  game?: GameId;
  tags?: string[];
  uploadedAt: string;
}

export interface PlayerProfile {
  id: string;
  _id?: string;
  username: string;
  displayName: string;
  avatar: string;
  banner: string;
  bio: string;
  location: string;
  team?: string;
  rank: Rank;
  tier: number;
  roles: PlayerRole[];
  preferredGames: GameId[];
  badges: ScrimLevel[];
  skillScore: number;
  profileViews: number;
  isOpenToTeam: boolean;
  stats: PlayerStats;
  achievements: Achievement[];
  clips: Clip[];
  followers: number;
  following: number;
  verified?: boolean;
  user?: { username: string; avatar: string; _id: string };
}

export interface OrganizationProfile {
  id: string;
  _id?: string;
  username: string;
  name: string;
  logo: string;
  description: string;
  location: string;
  verified?: boolean;
  followers: number;
  activeGames: GameId[];
  openRoles: PlayerRole[];
}

export interface FeedPost {
  id: string;
  _id?: string;
  authorId: string;
  authorType: PostAuthorType;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorMeta: string;
  game: GameId;
  gameTag?: GameId;
  body: string;
  content?: string;
  image?: string;
  mediaUrls?: string[];
  postType?: PostType;
  tags: string[];
  likes: number;
  likedByMe?: boolean;
  comments: number;
  commentsList?: CommentItem[];
  reposts: number;
  shares?: number;
  saves?: number;
  savedByMe?: boolean;
  poll?: PollData;
  linkedScrim?: unknown;
  linkedAchievement?: unknown;
  clubId?: string;
  createdAt: string;
}

export interface CommentItem {
  _id: string;
  user: { _id: string; username: string; avatar?: string };
  text: string;
  createdAt: string;
}

export interface PollData {
  question: string;
  options: { text: string; votes: number }[];
  totalVotes: number;
  myVote?: number | null;
}

export interface CommunityItem {
  id: string;
  _id?: string;
  type: CommunityItemType;
  title: string;
  host: string;
  game: GameId;
  date: string;
  startsAt?: string;
  slots?: number;
  maxSlots?: number;
  description: string;
  creator?: { _id: string; username: string; avatar?: string };
  participants?: string[];
  status?: "upcoming" | "live" | "ended" | "cancelled";
}

export interface ScrimEvent {
  id: string;
  _id?: string;
  kind: ScrimKind;
  title: string;
  organizer: string | { _id?: string; username?: string; avatar?: string };
  game: GameId;
  level: ScrimLevel | { tier: number; name: string };
  legacyLevel?: ScrimLevel;
  date?: string;
  startsAt?: string;
  scheduledAt?: string;
  format?: "Solo" | "Duo" | "Squad";
  prize?: string;
  registered: number;
  capacity: number;
  maxTeams?: number;
  rules?: string;
  xpReward?: number;
  registrations?: ScrimRegistration[];
  status: "draft" | "open" | "ongoing" | "completed" | "Open" | "Filling Fast" | "Invite Only" | "Closed";
}

export interface ScrimRegistration {
  _id: string;
  teamName?: string;
  players: string[];
  status: string;
}

export interface Notification {
  _id: string;
  id?: string;
  type: NotificationType;
  message: string;
  link?: string;
  isRead: boolean;
  sender?: { _id: string; username: string; avatar?: string };
  createdAt: string;
}

export interface LeaderboardEntry {
  position: number;
  _id: string;
  username: string;
  avatar?: string;
  displayName?: string;
  skillScore: number;
  stats?: PlayerStats;
  roles?: PlayerRole[];
  badges?: string[];
  followers?: number;
}

export interface Club {
  _id: string;
  id?: string;
  name: string;
  description: string;
  banner?: string;
  gameTag: GameId;
  creator: { _id: string; username: string; avatar?: string };
  admins?: string[];
  members?: string[];
  memberCount: number;
  isPrivate: boolean;
  rules?: string;
  tags?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}
