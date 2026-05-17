import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";

// Protected layout — checks localStorage on client.
// Note: SSR can't see localStorage, so we also guard in the component below.
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const token = window.localStorage.getItem("bgmi_token");
    if (!token) {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthGate,
});

function AuthGate() {
  // Client-only guard fallback (handles direct loads when SSR skipped the check)
  if (typeof window !== "undefined" && !window.localStorage.getItem("bgmi_token")) {
    window.location.href = "/login";
    return null;
  }
  return <Outlet />;
}
