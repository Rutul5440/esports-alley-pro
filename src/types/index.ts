export type Rank =
  | "Bronze" | "Silver" | "Gold" | "Platinum"
  | "Diamond" | "Crown" | "Ace" | "Conqueror";

export type PlayerRole = "IGL" | "Assaulter" | "Support" | "Sniper" | "Filter" | "Scout";

export interface User {
  id: string;
  username: string;
  email: string;
  role: "player" | "org" | "admin";
  token: string;
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
  title: string;
  tier: "bronze" | "silver" | "gold";
  earnedAt: string;
}

export interface Clip {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  views: number;
  likes: number;
  uploadedAt: string;
}

export interface PlayerProfile {
  id: string;
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
  stats: PlayerStats;
  achievements: Achievement[];
  clips: Clip[];
  followers: number;
  following: number;
  verified?: boolean;
}
