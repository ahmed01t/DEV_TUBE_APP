"use client";

import { useRouter } from "next/navigation";
import AppShell from "../components/AppShell";
import VideoForm from "../components/VideoForm";

function UploadContent() {
  const router = useRouter();
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8"><p className="text-sm font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">Creator studio</p><h1 className="mt-2 text-4xl font-black tracking-tight">Publish a video</h1><p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">Add your video, thumbnail, and the details viewers need before you publish.</p></div>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"><VideoForm onSaved={(savedVideo) => router.push(`/videos/${savedVideo._id}`)} /></section>
    </main>
  );
}

export default function UploadPage() { return <AppShell><UploadContent /></AppShell>; }
