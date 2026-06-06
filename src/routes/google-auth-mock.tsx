import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Chrome, Mail, User, PlusCircle } from "lucide-react";

export const Route = createFileRoute("/google-auth-mock")({
  head: () => ({ meta: [{ title: "Sign in - Google Accounts" }] }),
  component: GoogleAuthMock,
});

const preSavedAccounts = [
  {
    email: "rutulsuthar2018@gmail.com",
    fullName: "Rutul Suthar",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Rutul%20Suthar",
  },
  {
    email: "esports.conqueror@gmail.com",
    fullName: "Gamer Conqueror",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Conqueror",
  },
];

function GoogleAuthMock() {
  const [customMode, setCustomMode] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");

  const handleSelect = (account: (typeof preSavedAccounts)[0]) => {
    if (window.opener) {
      window.opener.postMessage(
        {
          type: "GOOGLE_AUTH_SUCCESS",
          email: account.email,
          fullName: account.fullName,
          avatar: account.avatar,
        },
        window.location.origin,
      );
      window.close();
    } else {
      alert(
        "This popup was opened directly. Click on 'Continue with Google' inside the Grid Lock app to authenticate properly.",
      );
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const avatar = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(fullName || email)}`;
    handleSelect({ email, fullName: fullName || email.split("@")[0], avatar });
  };

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-[420px] rounded-2xl border border-white/5 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-xl">
        {/* Google Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 shadow-inner">
            <Chrome size={24} className="text-[#4285F4] animate-pulse" />
          </div>
          <h1 className="mt-4 font-display text-xl font-bold tracking-tight text-white">Google</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Sign in to continue to <span className="text-primary font-semibold">Grid Lock</span>
          </p>
        </div>

        {/* Content Area */}
        <div className="mt-8">
          {!customMode ? (
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                Choose an account
              </div>

              {preSavedAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => handleSelect(account)}
                  className="flex w-full items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-left transition-all hover:bg-white/[0.06] hover:border-white/10 group cursor-pointer"
                >
                  <img
                    src={account.avatar}
                    alt={account.fullName}
                    className="h-10 w-10 rounded-full border border-white/10 object-cover"
                  />
                  <div className="flex-1 overflow-hidden">
                    <div className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                      {account.fullName}
                    </div>
                    <div className="text-xs text-zinc-400 truncate mt-0.5">{account.email}</div>
                  </div>
                  <Mail
                    size={16}
                    className="text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </button>
              ))}

              <button
                onClick={() => setCustomMode(true)}
                className="flex w-full items-center gap-4 rounded-xl border border-dashed border-white/10 bg-transparent p-4 text-left transition-all hover:bg-white/[0.04] hover:border-white/20 group cursor-pointer mt-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-zinc-400 group-hover:text-primary transition-colors">
                  <PlusCircle size={20} />
                </div>
                <div className="text-sm font-semibold text-zinc-400 group-hover:text-white transition-colors">
                  Use another email address
                </div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                Enter account details
              </div>

              <label className="block">
                <span className="text-xs text-zinc-400">Full Name (Optional)</span>
                <div className="relative mt-1.5">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rutul Suthar"
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-xs text-zinc-400">Email Address</span>
                <div className="relative mt-1.5">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rutul@example.com"
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </label>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCustomMode(false)}
                  className="flex-1 rounded-lg border border-white/10 py-2.5 text-xs font-bold text-zinc-300 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-gradient-gold py-2.5 text-xs font-bold text-[#141416] hover:opacity-90 transition-opacity shadow-gold cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-8 border-t border-white/5 pt-6 text-center text-xs leading-relaxed text-zinc-500">
          To continue, Google will share your name, email address, language preference, and profile
          picture with Grid Lock. See Grid Lock's Privacy Policy and Terms of Service.
        </div>
      </div>
    </main>
  );
}
