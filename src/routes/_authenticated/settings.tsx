import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { profileApi, authApi } from "@/lib/api";
import { games } from "@/lib/mock-data";
import type { GameId } from "@/types";
import { User, Shield, Gamepad2, Save, Loader2, Camera } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings - ConqLink" }] }),
  component: Settings,
});

function Settings() {
  const { user, completeProfile } = useAuth();
  const queryClient = useQueryClient();
  const isOrg = user?.role === "organization";

  const profileQuery = useQuery({
    queryKey: ["myProfile"],
    queryFn: () => profileApi.get(user?.username || ""),
    enabled: !!user?.username,
  });

  const profile = profileQuery.data;
  const playerProfile = profile?.type !== "organization" ? profile : null;

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [isOpenToTeam, setIsOpenToTeam] = useState(true);
  const [selectedGames, setSelectedGames] = useState<GameId[]>([]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Initialize form when profile loads
  const initialized = useState(false);
  if (playerProfile && !initialized[0]) {
    setDisplayName(playerProfile.displayName || user?.username || "");
    setBio(playerProfile.bio || "");
    setCountry(playerProfile.country || "");
    setIsOpenToTeam(playerProfile.isOpenToTeam ?? true);
    setSelectedGames(playerProfile.preferredGames || ["bgmi"]);
    initialized[1](true);
  }

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      if (avatarFile) {
        await authApi.uploadAvatar(avatarFile);
      }
      await profileApi.update({
        displayName,
        bio,
        country,
        isOpenToTeam,
        preferredGames: selectedGames,
      });
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const toggleGame = (id: GameId) => {
    setSelectedGames((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-display font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile, game preferences, and account.
        </p>

        {/* Profile Section */}
        <section className="mt-8 rounded-xl border border-border bg-card p-6 space-y-5">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <User size={20} className="text-primary" />
            <h2 className="font-display text-xl font-bold">Profile</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={
                  avatarFile
                    ? URL.createObjectURL(avatarFile)
                    : playerProfile?.user?.avatar ||
                      `https://api.dicebear.com/9.x/initials/svg?seed=${user?.username}`
                }
                alt=""
                className="h-20 w-20 rounded-full border-2 border-primary/30 object-cover"
              />
              <label className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground cursor-pointer hover:opacity-80">
                <Camera size={14} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
            <div>
              <p className="font-semibold">@{user?.username}</p>
              <p className="text-xs text-muted-foreground">
                {isOrg ? "Organization" : "Player"} account
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Display name
              </span>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1.5 w-full px-3 py-2.5 rounded-md bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Country / Region
              </span>
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. India"
                className="mt-1.5 w-full px-3 py-2.5 rounded-md bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Bio
            </span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={300}
              className="mt-1.5 w-full px-3 py-2.5 rounded-md bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
            <p className="mt-1 text-xs text-muted-foreground text-right">{bio.length}/300</p>
          </label>

          <label className="flex items-center justify-between rounded-md border border-border p-3 text-sm">
            Open to team recruitment
            <input
              type="checkbox"
              checked={isOpenToTeam}
              onChange={(e) => setIsOpenToTeam(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
          </label>
        </section>

        {/* Game Preferences */}
        <section className="mt-6 rounded-xl border border-border bg-card p-6 space-y-5">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <Gamepad2 size={20} className="text-primary" />
            <h2 className="font-display text-xl font-bold">Game Preferences</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Select games you actively play. This affects scouting visibility and feed filtering.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {games.map((g) => (
              <button
                key={g.id}
                onClick={() => toggleGame(g.id)}
                className={`rounded-lg border p-3 text-left transition-all ${
                  selectedGames.includes(g.id)
                    ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="font-semibold text-sm">{g.shortName}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{g.name}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Account */}
        <section className="mt-6 rounded-xl border border-border bg-card p-6 space-y-5">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <Shield size={20} className="text-primary" />
            <h2 className="font-display text-xl font-bold">Account</h2>
          </div>
          <div className="grid gap-3 text-sm">
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <span>Email</span>
              <span className="text-muted-foreground">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <span>Role</span>
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">
                {user?.role}
              </span>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-gradient-gold px-6 py-3 text-sm font-semibold text-primary-foreground shadow-gold disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving..." : "Save changes"}
          </button>
          {success && (
            <span className="text-sm text-green-500 font-medium">✓ Saved successfully!</span>
          )}
        </div>
      </div>
    </AppShell>
  );
}
