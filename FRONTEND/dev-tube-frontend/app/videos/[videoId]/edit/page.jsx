"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "../../../components/AppShell";
import VideoForm from "../../../components/VideoForm";
import { getVideo } from "../../../lib/api";

function EditVideoContent() {
  const { videoId } = useParams();
  const router = useRouter();
  const [video, setVideo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => { getVideo(videoId).then(setVideo).catch((requestError) => setError(requestError.message)); }, [videoId]);

  return <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6"><p className="text-sm font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">Creator studio</p><h1 className="mt-2 text-4xl font-black">Edit video</h1>{error && <p className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-200">{error}</p>}{!video && !error && <p className="mt-8 text-sm text-slate-500">Loading video details…</p>}{video && <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"><VideoForm video={video} onSaved={(savedVideo) => router.push(`/videos/${savedVideo._id}`)} /></section>}</main>;
}

export default function EditVideoPage() { return <AppShell><EditVideoContent /></AppShell>; }
