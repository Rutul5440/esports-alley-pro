import type {
  CommunityItem,
  FeedPost,
  Game,
  GameId,
  OrganizationProfile,
  PlayerProfile,
  ScrimEvent,
} from "@/types";

export const games: Game[] = [
  { id: "bgmi", name: "Battlegrounds Mobile India", shortName: "BGMI" },
  { id: "valorant", name: "Valorant", shortName: "VALO" },
  { id: "cs2", name: "Counter-Strike 2", shortName: "CS2" },
  { id: "free-fire", name: "Free Fire", shortName: "FF" },
  { id: "apex-legends", name: "Apex Legends Mobile", shortName: "APEX" },
  { id: "pubg-ns", name: "PUBG: New State", shortName: "PUBG:NS" },
];

export const gameName = (id: GameId | string) => games.find((g) => g.id === id)?.shortName ?? id;
export const getPlayerByUsername = (u: string) =>
  mockPlayers.find((p) => p.username.toLowerCase() === u.toLowerCase());

export const mockPlayers: PlayerProfile[] = [
  {
    id: "1",
    username: "ghostsniper",
    displayName: "GhostSniper",
    avatar: "https://i.pravatar.cc/200?img=12",
    banner: "",
    bio: "Pro BGMI sniper. 3x tournament finalist. Looking for tier-1 org.",
    location: "Mumbai, India",
    team: "Free Agent",
    rank: "Conqueror",
    tier: 1,
    roles: ["Sniper", "Scout"],
    preferredGames: ["bgmi"],
    badges: ["Elite", "Master"],
    skillScore: 96,
    profileViews: 18400,
    isOpenToTeam: true,
    stats: { matches: 1240, wins: 318, kills: 8420, kd: 4.6, avgDamage: 612, headshotPct: 38 },
    achievements: [{ id: "a1", title: "BMPS Finalist 2024", tier: "gold", earnedAt: "2024-09-01" }],
    clips: [
      {
        id: "c1",
        title: "4K Clutch Erangel",
        url: "",
        thumbnail: "https://picsum.photos/seed/clip1/640/360",
        views: 12400,
        likes: 980,
        uploadedAt: "2025-04-10",
      },
    ],
    followers: 12400,
    following: 180,
    verified: true,
  },
  {
    id: "2",
    username: "iglraven",
    displayName: "IGL Raven",
    avatar: "https://i.pravatar.cc/200?img=33",
    banner: "",
    bio: "In-game leader. Calm calls under pressure.",
    location: "Delhi, India",
    team: "Team Phoenix",
    rank: "Ace",
    tier: 2,
    roles: ["IGL", "Support"],
    preferredGames: ["bgmi", "valorant"],
    badges: ["Contender", "Elite"],
    skillScore: 88,
    profileViews: 9300,
    isOpenToTeam: false,
    stats: { matches: 980, wins: 240, kills: 4100, kd: 2.8, avgDamage: 410, headshotPct: 22 },
    achievements: [{ id: "a3", title: "BGIS Top 16", tier: "gold", earnedAt: "2024-11-01" }],
    clips: [],
    followers: 6200,
    following: 240,
  },
  {
    id: "3",
    username: "flickking",
    displayName: "FlickKing",
    avatar: "https://i.pravatar.cc/200?img=15",
    banner: "",
    bio: "Assaulter. TDM rated. Open to scrims and academy tryouts.",
    location: "Bangalore, India",
    team: "Free Agent",
    rank: "Crown",
    tier: 1,
    roles: ["Assaulter"],
    preferredGames: ["bgmi", "cs2"],
    badges: ["Rookie", "Contender"],
    skillScore: 91,
    profileViews: 14800,
    isOpenToTeam: true,
    stats: { matches: 2100, wins: 410, kills: 11200, kd: 5.2, avgDamage: 720, headshotPct: 44 },
    achievements: [{ id: "a4", title: "TDM Champion", tier: "gold", earnedAt: "2025-01-10" }],
    clips: [],
    followers: 9800,
    following: 90,
    verified: true,
  },
];

export const mockOrganizations: OrganizationProfile[] = [
  {
    id: "o1",
    username: "apexlegion",
    name: "Apex Legion",
    logo: "https://api.dicebear.com/9.x/shapes/svg?seed=Apex",
    description: "Tier-1 BGMI organization running academy trials and elite scrim blocks.",
    location: "India",
    verified: true,
    followers: 42800,
    activeGames: ["bgmi", "valorant"],
    openRoles: ["Assaulter", "Support"],
  },
];

export const feedPosts: FeedPost[] = [];
export const communityItems: CommunityItem[] = [];
export const scrimEvents: ScrimEvent[] = [];
