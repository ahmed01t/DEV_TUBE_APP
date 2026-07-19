import Link from "next/link";

function PlayIcon() {
  return (
    <svg aria-hidden="true" className="ml-0.5 size-5 fill-current" viewBox="0 0 24 24">
      <path d="M8.25 5.25v13.5L19.5 12 8.25 5.25Z" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-24 top-20 size-80 rounded-full bg-red-600/25 blur-3xl animate-[landing-drift_13s_ease-in-out_infinite] motion-reduce:animate-none" />
        <div className="absolute -right-24 bottom-0 size-96 rounded-full bg-fuchsia-600/20 blur-3xl animate-[landing-drift_16s_ease-in-out_infinite_reverse] motion-reduce:animate-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.07)_1px,transparent_1px)] bg-size-[56px_56px] [mask-image:radial-gradient(ellipse_80%_55%_at_50%_5%,black,transparent)]" />
      </div>

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Link href="/" aria-label="DevTube home" className="flex items-center text-2xl font-black uppercase tracking-tight">
          <span>DEV</span>
          <span className="ml-1 rounded bg-red-600 px-1.5 py-1 text-base tracking-wide text-white shadow-lg shadow-red-950/40">TUBE</span>
        </Link>
        <Link href="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white">
          Log in
        </Link>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-12 sm:px-8 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-28">
        <div className="max-w-2xl animate-[landing-reveal_700ms_ease-out_both] motion-reduce:animate-none">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-sm font-medium text-slate-200">
            <span className="size-2 rounded-full bg-red-500 shadow-[0_0_14px_3px_rgba(239,68,68,0.65)]" />
            Your ideas deserve an audience
          </p>
          <h1 className="text-5xl font-black leading-[0.96] tracking-tight text-white sm:text-6xl lg:text-7xl">
            A home for every
            <span className="mt-2 block bg-linear-to-r from-red-400 via-rose-300 to-fuchsia-300 bg-size-[200%_auto] bg-clip-text text-transparent animate-[landing-shine_5s_linear_infinite] motion-reduce:animate-none">
              developer story.
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
            Upload, share, and discover the videos that help the developer community build what comes next.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3.5 font-bold text-white shadow-xl shadow-red-950/35 transition hover:-translate-y-0.5 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-950">
              Create your channel
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3.5 font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-slate-950">
              Log in to DevTube
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-400">
            <span><strong className="text-white">∞</strong> ideas to explore</span>
            <span><strong className="text-white">1</strong> place to share them</span>
            <span><strong className="text-white">0</strong> noise</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl animate-[landing-float_6s_ease-in-out_infinite] motion-reduce:animate-none lg:justify-self-end">
          <div className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-linear-to-br from-red-500/35 via-fuchsia-500/15 to-transparent blur-2xl" aria-hidden="true" />
          <div className="overflow-hidden rounded-3xl border border-white/15 bg-slate-900/80 p-3 shadow-2xl shadow-black/45 backdrop-blur">
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-linear-to-br from-slate-800 via-slate-900 to-red-950">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(244,63,94,0.55),transparent_25%),radial-gradient(circle_at_25%_80%,rgba(168,85,247,0.36),transparent_30%)]" />
              <div className="absolute left-[18%] top-[18%] h-2 w-36 rounded-full bg-white/80" />
              <div className="absolute left-[18%] top-[28%] h-2 w-24 rounded-full bg-white/35" />
              <div className="absolute bottom-[16%] right-[16%] grid size-16 place-items-center rounded-full bg-red-600 text-white shadow-xl shadow-red-950/60 transition-transform duration-300 hover:scale-110">
                <PlayIcon />
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <p className="text-xs font-semibold text-red-200">NOW PLAYING</p>
                  <p className="mt-1 text-lg font-bold text-white">Build. Learn. Share.</p>
                </div>
                <span className="rounded-md bg-black/40 px-2 py-1 text-xs font-medium text-white">03:42</span>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 pb-1 pt-4">
              <div className="grid size-10 place-items-center rounded-full bg-linear-to-br from-red-500 to-fuchsia-600 text-sm font-black">D</div>
              <div>
                <p className="font-semibold text-white">DevTube Originals</p>
                <p className="text-sm text-slate-400">For developers, by developers</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
