"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell, { useSession } from "../../components/AppShell";
import { formatDate, formatViews } from "../../components/VideoCard";
import { addComment, deleteComment, getVideo, getVideoComments, updateComment } from "../../lib/api";

function VideoPageContent() {
  const { videoId } = useParams();
  const { user } = useSession();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  async function loadPage() {
    setIsLoading(true);
    setError("");
    try {
      const [nextVideo, nextComments] = await Promise.all([getVideo(videoId), getVideoComments(videoId)]);
      setVideo(nextVideo);
      setComments(nextComments || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { if (videoId) loadPage(); }, [videoId]);

  async function submitComment(event) {
    event.preventDefault();
    if (!commentText.trim()) return;
    setIsSending(true);
    try {
      const comment = await addComment(videoId, commentText.trim());
      setComments((current) => [comment, ...current]);
      setCommentText("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSending(false);
    }
  }

  async function saveComment(commentId) {
    if (!editText.trim()) return;
    try {
      const updated = await updateComment(videoId, commentId, editText.trim());
      setComments((current) => current.map((comment) => comment._id === commentId ? { ...comment, ...updated } : comment));
      setEditingComment(null);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function removeComment(commentId) {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteComment(videoId, commentId);
      setComments((current) => current.filter((comment) => comment._id !== commentId));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (isLoading) return <main className="grid min-h-[65vh] place-items-center"><p className="text-sm text-slate-500">Loading video…</p></main>;
  if (error && !video) return <main className="mx-auto max-w-3xl px-4 py-16"><div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">{error}</div></main>;

  const ownerId = typeof video.owner === "object" ? video.owner?._id : video.owner;
  const isOwner = String(ownerId) === String(user._id);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <section>
          <div className="aspect-video overflow-hidden rounded-2xl bg-black shadow-xl shadow-slate-300/40 dark:shadow-black/40">
            <video controls poster={video.thumbnail} className="size-full" src={video.videofile}>Your browser does not support video playback.</video>
          </div>
          <div className="mt-5 border-b border-slate-200 pb-6 dark:border-slate-800">
            <div className="flex flex-wrap items-start justify-between gap-4"><h1 className="max-w-3xl text-2xl font-black tracking-tight sm:text-3xl">{video.title}</h1>{isOwner && <Link href={`/videos/${video._id}/edit`} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold transition hover:border-red-400 hover:text-red-600 dark:border-slate-700 dark:hover:text-red-400">Edit video</Link>}</div>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{formatViews(video.views)} views · {formatDate(video.createdAt)}</p>
            <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-300">{video.description}</p>
          </div>

          <section className="mt-7">
            <h2 className="text-xl font-black">{comments.length} {comments.length === 1 ? "comment" : "comments"}</h2>
            <form onSubmit={submitComment} className="mt-5 flex gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-full bg-red-600 text-sm font-bold text-white">{user.fullname?.slice(0, 1).toUpperCase()}</div>
              <div className="flex-1"><input value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Add a comment…" className="w-full border-b border-slate-300 bg-transparent px-1 py-2 text-sm outline-none transition focus:border-red-500 dark:border-slate-700" /><div className="mt-2 flex justify-end"><button disabled={isSending || !commentText.trim()} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-500 disabled:opacity-50">{isSending ? "Posting…" : "Comment"}</button></div></div>
            </form>
            {error && <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-200">{error}</p>}
            <div className="mt-6 space-y-6">
              {comments.map((comment) => {
                const commentOwnerId = typeof comment.owner === "object" ? comment.owner?._id : comment.owner;
                const canManage = String(commentOwnerId) === String(user._id);
                return <article key={comment._id} className="flex gap-3"><div className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-200 text-xs font-black text-slate-700 dark:bg-slate-800 dark:text-slate-200">{comment.owner?.username?.slice(0, 1).toUpperCase() || "D"}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-x-2 gap-y-1"><p className="text-sm font-bold">{comment.owner?.username || "DevTube user"}</p><p className="text-xs text-slate-500">{formatDate(comment.createdAt)}</p></div>{editingComment === comment._id ? <div className="mt-2"><textarea value={editText} onChange={(event) => setEditText(event.target.value)} rows={3} className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm outline-none focus:border-red-500 dark:border-slate-700 dark:bg-slate-900" /><div className="mt-2 flex gap-2"><button onClick={() => saveComment(comment._id)} type="button" className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white">Save</button><button onClick={() => setEditingComment(null)} type="button" className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-500">Cancel</button></div></div> : <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-300">{comment.content}</p>}{canManage && editingComment !== comment._id && <div className="mt-2 flex gap-3"><button type="button" onClick={() => { setEditingComment(comment._id); setEditText(comment.content); }} className="text-xs font-bold text-slate-500 hover:text-red-600 dark:hover:text-red-400">Edit</button><button type="button" onClick={() => removeComment(comment._id)} className="text-xs font-bold text-slate-500 hover:text-red-600 dark:hover:text-red-400">Delete</button></div>}</div></article>;
              })}
              {!comments.length && <p className="text-sm text-slate-500">Start the conversation.</p>}
            </div>
          </section>
        </section>
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">Up next</p><h2 className="mt-2 text-lg font-black">Keep exploring</h2><p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Return to the feed to find another developer story worth watching.</p><Link href="/dashboard" className="mt-5 inline-flex rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white dark:bg-white dark:text-slate-950">Browse videos</Link></aside>
      </div>
    </main>
  );
}

export default function VideoPage() { return <AppShell><VideoPageContent /></AppShell>; }
