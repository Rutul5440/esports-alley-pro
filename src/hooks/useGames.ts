import { useQuery } from "@tanstack/react-query";
import { gamesApi } from "@/lib/api";
import { games as fallbackGames, gameName as fallbackGameName } from "@/lib/mock-data";
import type { GameId } from "@/types";

/**
 * Hook for dynamic game registry.
 * Fetches games from the API and falls back to local mock data.
 * Use this instead of importing `games` directly from mock-data
 * when you want the dynamic list to reflect API additions.
 */
export function useGames() {
  const query = useQuery({
    queryKey: ["games"],
    queryFn: gamesApi.list,
    staleTime: 10 * 60 * 1000, // 10 min
    gcTime: 30 * 60 * 1000,
  });

  const games = query.data?.length ? query.data : fallbackGames;

  const gameName = (id: GameId | string) =>
    games.find((g: any) => g.id === id)?.shortName ?? fallbackGameName(id);

  const gameById = (id: GameId | string) => games.find((g: any) => g.id === id) ?? null;

  const gameIds = games.map((g: any) => g.id as GameId);

  return {
    games,
    gameName,
    gameById,
    gameIds,
    isLoading: query.isLoading,
  };
}
