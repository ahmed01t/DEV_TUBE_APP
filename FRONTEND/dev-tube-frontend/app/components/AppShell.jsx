"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, logout } from "../lib/api";
import NavBar from "./NavBar";

const SessionContext = createContext(null);

export function useSession() {
  const session = useContext(SessionContext);
  if (!session) throw new Error("useSession must be used inside AppShell");
  return session;
}

function PageLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 px-6 text-white">
      <div className="text-center">
        <div className="mx-auto size-10 animate-spin rounded-full border-2 border-slate-700 border-t-red-500" />
        <p className="mt-4 text-sm text-slate-400">Loading your DevTube workspace…</p>
      </div>
    </div>
  );
}

function SignedOutState({ message }) {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8 text-center shadow-2xl shadow-black/40">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-400">DevTube</p>
        <h1 className="mt-3 text-3xl font-black">Sign in to continue</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">{message || "Your session has ended. Log in to access your channel and videos."}</p>
        <Link href="/login" className="mt-6 inline-flex rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500">Go to login</Link>
      </div>
    </div>
  );
}

function AuthenticatedShell({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function reloadUser() {
    const nextUser = await getCurrentUser();
    setUser(nextUser);
    return nextUser;
  }

  useEffect(() => {
    reloadUser()
      .catch((requestError) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  }, []);

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  if (isLoading) return <PageLoader />;
  if (!user) return <SignedOutState message={error} />;

  return (
    <SessionContext.Provider value={{ user, setUser, reloadUser }}>
      <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
        <NavBar profileName={user.fullname} profileUsername={user.username} profileImageUrl={user.avatar} onLogout={handleLogout} />
        {children}
      </div>
    </SessionContext.Provider>
  );
}

export default function AppShell({ children }) {
  return <AuthenticatedShell>{children}</AuthenticatedShell>;
}
