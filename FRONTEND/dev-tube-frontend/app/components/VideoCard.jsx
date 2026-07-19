import Link from "next/link";

export function formatViews(views = 0) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(views);
}

export function formatDuration(duration = 0) {
  const totalSeconds = Math.round(Number(duration) || 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return hours
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function formatDate(date) {
  if (!date) return "Recently";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

export default function VideoCard({ video, action }) {
  const creator = typeof video.owner === "object" ? video.owner?.username || video.owner?.fullname : "DevTube creator";

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-300/60 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/30">
      <Link href={`/videos/${video._id}`} className="relative block aspect-video overflow-hidden bg-slate-200 dark:bg-slate-800" aria-label={`Watch ${video.title}`}>
        {video.thumbnail ? <img src={video.thumbnail} alt="" className="size-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="size-full bg-linear-to-br from-red-600 to-fuchsia-700" />}
        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-bold text-white">{formatDuration(video.duration)}</span>
        <span className="absolute inset-0 grid place-items-center bg-slate-950/0 text-white opacity-0 transition duration-300 group-hover:bg-slate-950/30 group-hover:opacity-100"><span className="grid size-12 place-items-center rounded-full bg-red-600 shadow-lg">▶</span></span>
      </Link>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-linear-to-br from-red-500 to-fuchsia-600 text-xs font-black text-white">{creator.slice(0, 1).toUpperCase()}</div>
          <div className="min-w-0 flex-1">
            <Link href={`/videos/${video._id}`} className="line-clamp-2 text-sm font-bold leading-5 text-slate-950 transition hover:text-red-600 dark:text-white dark:hover:text-red-400">{video.title}</Link>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{creator}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{formatViews(video.views)} views · {formatDate(video.createdAt)}</p>
          </div>
        </div>
        {action && <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-800">{action}</div>}
      </div>
    </article>
  );
}
