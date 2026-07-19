"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell, { useSession } from "../components/AppShell";
import { formatDate, formatViews } from "../components/VideoCard";
import { deleteVideo, getChannelStats, getChannelVideos } from "../lib/api";

function StudioContent() {
  const { user } = useSession();
  const [stats, setStats] = useState({ totalVideos: 0, totalSubscribers: 0, totalViews: 0 });
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadStudio() {
    setIsLoading(true);
    setError("");
    const [statsResult, videosResult] = await Promise.allSettled([getChannelStats(user._id), getChannelVideos(user._id)]);
    if (statsResult.status === "fulfilled") setStats(statsResult.value);
    if (videosResult.status === "fulfilled") setVideos(videosResult.value.videos || []);
    if (statsResult.status === "rejected" && videosResult.status === "rejected") setError(videosResult.reason?.message || statsResult.reason?.message || "Could not load your studio.");
    setIsLoading(false);
  }

  useEffect(() => { loadStudio(); }, [user._id]);

  async function removeVideo(videoId) {
    if (!window.confirm("Delete this video permanently?")) return;
    try {
      await deleteVideo(videoId);
      setVideos((current) => current.filter((video) => video._id !== videoId));
      setStats((current) => ({ ...current, totalVideos: Math.max(0, current.totalVideos - 1) }));
    } catch (requestError) { setError(requestError.message); }
  }

  return <main className="mx-auto w-full max-w-7xl px-4 py-9 sm:px-6 lg:px-8"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">Creator studio</p><h1 className="mt-2 text-4xl font-black tracking-tight">Your channel at a glance</h1><p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Manage every video you have published.</p></div><Link href="/upload" className="rounded-xl bg-red-600 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-red-500">Upload video</Link></div>{error && <p className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-200">{error}</p>}<section className="mt-8 grid gap-4 sm:grid-cols-3">{[["Published videos", stats.totalVideos], ["Channel views", stats.totalViews], ["Subscribers", stats.totalSubscribers]].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-2 text-3xl font-black">{Number(value || 0).toLocaleString()}</p></div>)}</section><section className="mt-10"><h2 className="text-2xl font-black">Published videos</h2>{isLoading ? <p className="mt-6 text-sm text-slate-500">Loading studio…</p> : null}{!isLoading && !videos.length ? <div className="mt-6 rounded-3xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700"><p className="font-bold">Your channel is ready for its first upload.</p><Link href="/upload" className="mt-4 inline-flex rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white">Upload now</Link></div> : null}{videos.length ? <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"><div className="divide-y divide-slate-100 dark:divide-slate-800">{videos.map((video) => <article key={video._id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"><Link href={`/videos/${video._id}`} className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-slate-200 sm:w-48 dark:bg-slate-800">{video.thumbnail && <img src={video.thumbnail} alt="" className="size-full object-cover" />}</Link><div className="min-w-0 flex-1"><Link href={`/videos/${video._id}`} className="font-bold hover:text-red-600 dark:hover:text-red-400">{video.title}</Link><p className="mt-1 text-sm text-slate-500">{formatViews(video.views)} views · {formatDate(video.createdAt)}</p></div><div className="flex shrink-0 gap-2"><Link href={`/videos/${video._id}/edit`} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold hover:border-red-400 hover:text-red-600 dark:border-slate-700 dark:hover:text-red-400">Edit</Link><button onClick={() => removeVideo(video._id)} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 dark:border-red-900/70 dark:text-red-400 dark:hover:bg-red-950/30">Delete</button></div></article>)}</div></div> : null}</section></main>;
}

export default function StudioPage() { return <AppShell><StudioContent /></AppShell>; }
