"use client";

import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import VideoCard from "../components/VideoCard";
import { getWatchHistory } from "../lib/api";

function HistoryContent() {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { getWatchHistory().then((history) => setVideos(history || [])).catch((requestError) => setError(requestError.message)).finally(() => setIsLoading(false)); }, []);

  return <main className="mx-auto w-full max-w-7xl px-4 py-9 sm:px-6 lg:px-8"><p className="text-sm font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">Library</p><h1 className="mt-2 text-4xl font-black tracking-tight">Watch history</h1><p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Pick up where you left off.</p>{error && <p className="mt-7 rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-200">{error}</p>}{isLoading ? <p className="mt-8 text-sm text-slate-500">Loading history…</p> : null}{!isLoading && !error && !videos.length ? <div className="mt-8 rounded-3xl border border-dashed border-slate-300 p-12 text-center text-sm text-slate-500 dark:border-slate-700">Videos you watch will appear here.</div> : null}{videos.length ? <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{videos.map((video) => <VideoCard key={video._id} video={video} />)}</div> : null}</main>;
}

export default function HistoryPage() { return <AppShell><HistoryContent /></AppShell>; }
