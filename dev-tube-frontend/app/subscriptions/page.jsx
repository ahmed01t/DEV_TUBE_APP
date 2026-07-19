"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell, { useSession } from "../components/AppShell";
import { getSubscribedChannels } from "../lib/api";

function SubscriptionsContent() {
  const { user } = useSession();
  const [subscriptions, setSubscriptions] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { getSubscribedChannels(user._id).then((data) => setSubscriptions(data.subscribedChannels || [])).catch((requestError) => setError(requestError.message)).finally(() => setIsLoading(false)); }, [user._id]);

  return <main className="mx-auto w-full max-w-5xl px-4 py-9 sm:px-6"><p className="text-sm font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">Community</p><h1 className="mt-2 text-4xl font-black tracking-tight">Subscriptions</h1><p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Channels you are following.</p>{error && <p className="mt-7 rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-200">{error}</p>}{isLoading ? <p className="mt-8 text-sm text-slate-500">Loading subscriptions…</p> : null}{!isLoading && !error && !subscriptions.length ? <div className="mt-8 rounded-3xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700"><p className="font-bold">Your subscriptions will appear here.</p><Link href="/dashboard" className="mt-4 inline-flex rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white">Discover videos</Link></div> : null}{subscriptions.length ? <div className="mt-8 grid gap-4 sm:grid-cols-2">{subscriptions.map((subscription) => { const channel = subscription.channel || {}; return <Link key={subscription._id} href={channel.username ? `/channel/${channel.username}` : "/dashboard"} className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-red-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-red-700"><span className="grid size-14 place-items-center rounded-full bg-linear-to-br from-red-500 to-fuchsia-600 text-lg font-black text-white">{(channel.fullname || channel.name || "D").slice(0, 1)}</span><span className="min-w-0"><span className="block truncate font-bold group-hover:text-red-600 dark:group-hover:text-red-400">{channel.fullname || channel.name || "DevTube channel"}</span><span className="mt-1 block truncate text-sm text-slate-500">{channel.email || "Creator channel"}</span></span></Link>; })}</div> : null}</main>;
}

export default function SubscriptionsPage() { return <AppShell><SubscriptionsContent /></AppShell>; }
