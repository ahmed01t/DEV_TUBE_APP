"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell, { useSession } from "../../components/AppShell";
import VideoCard from "../../components/VideoCard";
import { getChannelProfile, getChannelSubscribers, getVideos, toggleSubscription } from "../../lib/api";

function ChannelContent() {
  const { username } = useParams();
  const { user } = useSession();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadChannel() {
      setIsLoading(true);
      setError("");
      try {
        const profile = await getChannelProfile(username);
        setChannel(profile);
        const [videoResponse, subscriberResponse] = await Promise.all([
          getVideos({ userId: profile._id, limit: 24 }),
          getChannelSubscribers(profile._id),
        ]);
        setVideos(videoResponse.videos || []);
        setSubscribers(subscriberResponse.subscribers || []);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (username) loadChannel();
  }, [username]);

  async function handleSubscription() {
    if (!channel || isToggling) return;
    setIsToggling(true);
    try {
      const wasSubscribed = channel.isSubscribed;
      await toggleSubscription(channel._id);
      setChannel((current) => ({ ...current, isSubscribed: !wasSubscribed, subscribersCount: Math.max(0, (current.subscribersCount || 0) + (wasSubscribed ? -1 : 1)) }));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsToggling(false);
    }
  }

  if (isLoading) return <main className="grid min-h-[65vh] place-items-center"><p className="text-sm text-slate-500">Loading channel…</p></main>;
  if (!channel) return <main className="mx-auto max-w-3xl px-4 py-16"><div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">{error || "Channel not found."}</div></main>;

  const isOwnChannel = String(channel._id) === String(user._id);

  return (
    <main>
      <section className="relative h-44 overflow-hidden bg-linear-to-br from-red-600 via-rose-700 to-fuchsia-800 sm:h-60">
        {channel.coverImage && <img src={channel.coverImage} alt="" className="size-full object-cover" />}
        <div className="absolute inset-0 bg-slate-950/20" />
      </section>
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-14 flex flex-col gap-5 pb-8 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4"><div className="grid size-28 shrink-0 place-items-center overflow-hidden rounded-full border-4 border-slate-50 bg-red-600 text-3xl font-black text-white shadow-xl dark:border-slate-950 sm:size-32">{channel.avatar ? <img src={channel.avatar} alt={`${channel.fullname}'s avatar`} className="size-full object-cover" /> : channel.fullname?.slice(0, 1)}</div><div className="pb-1"><h1 className="text-2xl font-black sm:text-3xl">{channel.fullname}</h1><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">@{channel.username} · {channel.subscribersCount || 0} subscribers</p></div></div>
          {isOwnChannel ? <Link href="/studio" className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold transition hover:border-red-400 hover:text-red-600 dark:border-slate-700 dark:bg-slate-900 dark:hover:text-red-400">Manage channel</Link> : <button onClick={handleSubscription} disabled={isToggling} className={`rounded-xl px-5 py-2.5 text-sm font-bold transition disabled:opacity-70 ${channel.isSubscribed ? "bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700" : "bg-red-600 text-white hover:bg-red-500"}`}>{isToggling ? "Saving…" : channel.isSubscribed ? "Subscribed" : "Subscribe"}</button>}
        </div>

        {error && <p className="mb-6 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-200">{error}</p>}
        <div className="grid gap-10 border-t border-slate-200 py-8 lg:grid-cols-[minmax(0,1fr)_17rem] dark:border-slate-800">
          <section><div className="flex items-center justify-between"><h2 className="text-2xl font-black">Videos</h2><span className="text-sm text-slate-500">{videos.length} published</span></div>{videos.length ? <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{videos.map((video) => <VideoCard key={video._id} video={video} />)}</div> : <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700">No published videos yet.</div>}</section>
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">Community</p><h2 className="mt-2 text-lg font-black">Subscribers</h2><p className="mt-1 text-sm text-slate-500">{subscribers.length} people following this channel.</p><div className="mt-5 space-y-3">{subscribers.slice(0, 5).map((subscription) => <div key={subscription._id} className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-full bg-slate-200 text-xs font-black dark:bg-slate-800">{(subscription.subscriber?.fullname || subscription.subscriber?.name || "D").slice(0, 1)}</span><span className="truncate text-sm font-semibold">{subscription.subscriber?.fullname || subscription.subscriber?.name || "DevTube user"}</span></div>)}{!subscribers.length && <p className="text-sm text-slate-500">Be the first to subscribe.</p>}</div></aside>
        </div>
      </section>
    </main>
  );
}

export default function ChannelPage() { return <AppShell><ChannelContent /></AppShell>; }
