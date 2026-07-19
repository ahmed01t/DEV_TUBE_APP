"use client";

import { useState } from "react";
import { publishVideo, updateVideo } from "../lib/api";

export default function VideoForm({ video, onSaved }) {
  const isEditing = Boolean(video?._id);
  const [title, setTitle] = useState(video?.title || "");
  const [description, setDescription] = useState(video?.description || "");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      let savedVideo;
      if (isEditing) {
        savedVideo = await updateVideo(video._id, { title, description });
      } else {
        if (!videoFile || !thumbnailFile) throw new Error("Choose both a video file and a thumbnail.");
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("video", videoFile);
        formData.append("thumbnail", thumbnailFile);
        savedVideo = await publishVideo(formData);
      }
      await onSaved(savedVideo);
    } catch (requestError) {
      setError(requestError.message || "Could not save this video.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <label className="block">
        <span className="mb-2 block text-sm font-bold">Video title</span>
        <input value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={120} placeholder="What are you building?" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10 dark:border-slate-700 dark:bg-slate-950" />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-bold">Description</span>
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} required rows={6} placeholder="Tell viewers what they will learn." className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10 dark:border-slate-700 dark:bg-slate-950" />
      </label>
      {!isEditing && <div className="grid gap-4 sm:grid-cols-2">
        <label className="group flex min-h-36 cursor-pointer flex-col justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 transition hover:border-red-400 hover:bg-red-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-red-950/20">
          <span className="text-sm font-bold">Video file</span>
          <span className="mt-1 text-xs text-slate-500">MP4, WebM, or a supported video format</span>
          <span className="mt-3 truncate text-sm font-medium text-red-600 dark:text-red-400">{videoFile?.name || "Choose video"}</span>
          <input type="file" accept="video/*" className="sr-only" onChange={(event) => setVideoFile(event.target.files?.[0] || null)} />
        </label>
        <label className="group flex min-h-36 cursor-pointer flex-col justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 transition hover:border-red-400 hover:bg-red-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-red-950/20">
          <span className="text-sm font-bold">Thumbnail</span>
          <span className="mt-1 text-xs text-slate-500">A clear image that invites a click</span>
          <span className="mt-3 truncate text-sm font-medium text-red-600 dark:text-red-400">{thumbnailFile?.name || "Choose image"}</span>
          <input type="file" accept="image/*" className="sr-only" onChange={(event) => setThumbnailFile(event.target.files?.[0] || null)} />
        </label>
      </div>}
      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200" role="alert">{error}</p>}
      <button disabled={isSaving} className="w-full rounded-xl bg-red-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-900/20 transition hover:-translate-y-0.5 hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70">{isSaving ? "Saving…" : isEditing ? "Save video details" : "Publish video"}</button>
    </form>
  );
}
