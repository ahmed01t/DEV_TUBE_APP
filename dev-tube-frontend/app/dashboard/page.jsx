"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AppShell, { useSession } from "../components/AppShell";
import VideoCard from "../components/VideoCard";
import { getVideos } from "../lib/api";

function DashboardContent() {
  const { user } = useSession();
  const searchParams = useSearchParams();
  const searchFromUrl = searchParams.get("search") || "";
  const [videos, setVideos] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadVideos(searchQuery = query) {
    setIsLoading(true);
    setError("");
    try {
      const result = await getVideos({ limit: 24, query: searchQuery });
      setVideos(result.videos || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setQuery(searchFromUrl);
    loadVideos(searchFromUrl);
  }, [searchFromUrl]);

  function handleSubmit(event) {
    event.preventDefault();
    loadVideos(query.trim());
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-10 text-white shadow-xl shadow-slate-300/50 dark:shadow-black/35 sm:px-10">
        <div className="absolute -right-20 -top-20 size-72 rounded-full bg-red-600/25 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-28 left-1/3 size-72 rounded-full bg-fuchsia-600/20 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-300">Welcome back, {user.fullname?.split(" ")[0]}</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Build something worth sharing.</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">Discover fresh developer stories, then upload the one you have been working on.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/upload" className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-red-500">Upload a video</Link>
            <Link href={`/channel/${user.username}`} className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">View my channel</Link>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">Explore</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight">Latest videos</h2>
          </div>
          <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title or description" className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10 dark:border-slate-700 dark:bg-slate-900" />
            <button className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">Search</button>
          </form>
        </div>

        {error && <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">{error}</div>}
        {isLoading ? <div className="mt-8 grid place-items-center rounded-2xl border border-dashed border-slate-300 p-16 text-sm text-slate-500 dark:border-slate-700">Loading videos…</div> : null}
        {!isLoading && !error && videos.length === 0 ? <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900"><p className="text-lg font-bold">No videos found yet</p><p className="mt-2 text-sm text-slate-500">Try another search or be the first creator to publish one.</p><Link href="/upload" className="mt-5 inline-flex rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-500">Publish a video</Link></div> : null}
        {!isLoading && videos.length > 0 && <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{videos.map((video) => <VideoCard key={video._id} video={video} />)}</div>}
      </section>
    </main>
  );
}

export default function DashboardPage() {
  return <AppShell><Suspense fallback={<main className="grid min-h-[65vh] place-items-center"><p className="text-sm text-slate-500">Loading videos…</p></main>}><DashboardContent /></Suspense></AppShell>;
}
