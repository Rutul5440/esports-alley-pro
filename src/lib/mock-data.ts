import type { PlayerProfile } from "@/types";

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
    stats: { matches: 1240, wins: 318, kills: 8420, kd: 4.6, avgDamage: 612, headshotPct: 38 },
    achievements: [
      { id: "a1", title: "BMPS Finalist 2024", tier: "gold", earnedAt: "2024-09-01" },
      { id: "a2", title: "10K Kills Club", tier: "silver", earnedAt: "2024-06-15" },
    ],
    clips: [
      { id: "c1", title: "4K Clutch Erangel", url: "", thumbnail: "https://picsum.photos/seed/clip1/640/360", views: 12400, likes: 980, uploadedAt: "2025-04-10" },
      { id: "c2", title: "1v4 Sniper Wipe", url: "", thumbnail: "https://picsum.photos/seed/clip2/640/360", views: 8200, likes: 612, uploadedAt: "2025-03-22" },
    ],
    followers: 12400, following: 180, verified: true,
  },
  {
    id: "2", username: "iglraven", displayName: "IGL Raven", avatar: "https://i.pravatar.cc/200?img=33",
    banner: "", bio: "In-Game Leader. Calm calls under pressure.", location: "Delhi, India", team: "Team Phoenix",
    rank: "Ace", tier: 2, roles: ["IGL", "Support"],
    stats: { matches: 980, wins: 240, kills: 4100, kd: 2.8, avgDamage: 410, headshotPct: 22 },
    achievements: [{ id: "a3", title: "BGIS Top 16", tier: "gold", earnedAt: "2024-11-01" }],
    clips: [{ id: "c3", title: "Zone Read Genius", url: "", thumbnail: "https://picsum.photos/seed/clip3/640/360", views: 5400, likes: 320, uploadedAt: "2025-02-11" }],
    followers: 6200, following: 240,
  },
  {
    id: "3", username: "flickking", displayName: "FlickKing", avatar: "https://i.pravatar.cc/200?img=15",
    banner: "", bio: "Assaulter. TDM rated. Open to scrims.", location: "Bangalore, India", team: "Free Agent",
    rank: "Crown", tier: 1, roles: ["Assaulter"],
    stats: { matches: 2100, wins: 410, kills: 11200, kd: 5.2, avgDamage: 720, headshotPct: 44 },
    achievements: [{ id: "a4", title: "TDM Champion", tier: "gold", earnedAt: "2025-01-10" }],
    clips: [],
    followers: 9800, following: 90, verified: true,
  },
  {
    id: "4", username: "silentscout", displayName: "Silent Scout", avatar: "https://i.pravatar.cc/200?img=68",
    banner: "", bio: "Scout main, info gatherer.", location: "Pune, India", team: "Team Vortex",
    rank: "Diamond", tier: 3, roles: ["Scout", "Support"],
    stats: { matches: 540, wins: 110, kills: 2200, kd: 2.4, avgDamage: 380, headshotPct: 19 },
    achievements: [],
    clips: [],
    followers: 1240, following: 320,
  },
  {
    id: "5", username: "fragmaster", displayName: "FragMaster", avatar: "https://i.pravatar.cc/200?img=51",
    banner: "", bio: "Filter / Entry fragger. Aggressive playstyle.", location: "Kolkata, India", team: "Free Agent",
    rank: "Ace", tier: 1, roles: ["Filter", "Assaulter"],
    stats: { matches: 1620, wins: 290, kills: 7800, kd: 4.1, avgDamage: 580, headshotPct: 36 },
    achievements: [{ id: "a5", title: "MVP Week", tier: "silver", earnedAt: "2025-03-01" }],
    clips: [],
    followers: 4200, following: 150,
  },
  {
    id: "6", username: "shadowigl", displayName: "ShadowIGL", avatar: "https://i.pravatar.cc/200?img=22",
    banner: "", bio: "IGL with 4 years pro scene experience.", location: "Hyderabad, India", team: "Apex Legion",
    rank: "Conqueror", tier: 2, roles: ["IGL"],
    stats: { matches: 1800, wins: 520, kills: 5200, kd: 2.9, avgDamage: 440, headshotPct: 24 },
    achievements: [{ id: "a6", title: "BMPS Champion 2023", tier: "gold", earnedAt: "2023-12-01" }],
    clips: [],
    followers: 18400, following: 60, verified: true,
  },
];

export const getPlayerByUsername = (u: string) =>
  mockPlayers.find((p) => p.username.toLowerCase() === u.toLowerCase());
