"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../lib/auth";
import Router from "next/router";
import Page from "../dashboard/page";
import styles from "./page.module.css";

function PlayIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-current">
      <path d="M8.2 5.2v13.6L19.6 12 8.2 5.2Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-[1.8]">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4.5 7 7.5 5.5L19.5 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-[1.8]">
      <rect x="4" y="10" width="16" height="10" rx="2.5" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-[1.8]">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.4 3.1-5.2 7-5.2s6.2 1.8 7 5.2" />
    </svg>
  );
}

function EyeIcon({ visible }) {
  return visible ? (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-[1.8]">
      <path d="M2.5 12s3.4-5.5 9.5-5.5S21.5 12 21.5 12 18.1 17.5 12 17.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-[1.8]">
      <path d="m3 3 18 18M10.6 6.7A10.8 10.8 0 0 1 12 6.5c6.1 0 9.5 5.5 9.5 5.5a15.2 15.2 0 0 1-3.1 3.6M6.1 6.1A15.7 15.7 0 0 0 2.5 12s3.4 5.5 9.5 5.5c1.2 0 2.3-.2 3.2-.6" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();

  async function handleSubmit(event) {
    // prevent default meaning it will prevent the page from reloading when the form is submitted
    event.preventDefault();
    try {
      await login(email, username, password);
      alert("Login successful!");

      // after successful loginn, redirect to the dashboard page
      router.push("/dashboard");
    } catch (error) {
        console.error("Login error:", error.message);
      alert("Login failed. Please check your credentials.");
    }
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-slate-950 px-5 py-5 text-white sm:px-8 sm:py-8">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className={`absolute -left-24 top-10 size-[26rem] rounded-full bg-red-600/20 blur-3xl ${styles.driftOne}`} />
        <div className={`absolute -right-32 bottom-0 size-[30rem] rounded-full bg-fuchsia-600/20 blur-3xl ${styles.driftTwo}`} />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.055)_1px,transparent_1px)] bg-size-[48px_48px] [mask-image:radial-gradient(ellipse_100%_70%_at_50%_0%,black,transparent)]" />
      </div>

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link href="/" aria-label="DevTube home" className="group flex items-center gap-2 text-xl font-black uppercase tracking-tight sm:text-2xl">
          <span>DEV</span>
          <span className="rounded bg-red-600 px-1.5 py-1 text-sm tracking-wide text-white shadow-lg shadow-red-950/40 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">TUBE</span>
        </Link>
        <p className="hidden text-sm text-slate-400 sm:block">
          New to DevTube?{" "}
          <Link href="/signup" className="font-semibold text-red-400 transition hover:text-red-300">Create a channel</Link>
        </p>
      </header>

      <section className="mx-auto grid w-full max-w-7xl items-center gap-12 py-12 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[1fr_0.94fr] lg:py-8">
        <div className={`relative hidden max-w-xl lg:block ${styles.contentReveal}`}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-300 backdrop-blur">
            <span className={`size-2 rounded-full bg-red-500 shadow-[0_0_12px_3px_rgba(239,68,68,0.55)] ${styles.pulseDot}`} />
            <span>Creator network online</span>
          </div>
          <h1 className="max-w-lg text-5xl font-black leading-[0.97] tracking-tight text-white xl:text-6xl">
            Your next idea is ready for its <span className="bg-linear-to-r from-red-400 via-rose-300 to-fuchsia-300 bg-size-[200%_auto] bg-clip-text text-transparent animate-[landing-shine_5s_linear_infinite]">audience.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-slate-400">
            Pick up where you left off. Your channel, watch history, and developer community are waiting.
          </p>

          <div className="relative mt-11 h-64 max-w-lg">
            <div className={`absolute left-0 top-9 w-72 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/85 p-3 shadow-2xl shadow-black/30 backdrop-blur ${styles.videoCard}`}>
              <div className="relative aspect-video overflow-hidden rounded-xl bg-linear-to-br from-red-500 via-rose-600 to-fuchsia-700">
                <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.5)_50%,transparent_65%)] bg-size-[200%_100%] animate-[landing-shine_4s_linear_infinite]" />
                <div className="absolute bottom-3 left-3 grid size-10 place-items-center rounded-full bg-white/90 text-red-600 shadow-lg"><PlayIcon /></div>
                <span className="absolute right-3 top-3 rounded-md bg-black/35 px-2 py-1 text-[10px] font-bold tracking-wider text-white">DEV LOG</span>
              </div>
              <div className="flex items-center gap-3 px-1 pb-1 pt-3">
                <div className="grid size-8 place-items-center rounded-full bg-linear-to-br from-red-500 to-orange-400 text-xs font-black">K</div>
                <div>
                  <p className="text-sm font-bold text-white">Ship it, then shape it</p>
                  <p className="text-xs text-slate-400">Kira Chen · 12 min</p>
                </div>
              </div>
            </div>

            <div className={`absolute bottom-0 right-0 w-64 rounded-2xl border border-white/10 bg-slate-900/75 p-4 shadow-2xl shadow-black/25 backdrop-blur ${styles.activityCard}`}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Community pulse</p>
                <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.45)]" />
              </div>
              <div className="mt-4 flex items-end gap-1.5">
                {[38, 62, 46, 84, 58, 94, 72, 88, 64].map((height, index) => (
                  <span key={index} className={`w-full rounded-t-full bg-linear-to-t from-red-600 to-fuchsia-400 ${styles.equalizer}`} style={{ height: `${height}%`, animationDelay: `${index * 110}ms` }} />
                ))}
              </div>
              <p className="mt-3 text-sm font-semibold text-white">1,248 developers sharing today</p>
            </div>

            <div className={`absolute left-[52%] top-0 grid size-14 place-items-center rounded-2xl border border-white/15 bg-white/10 text-red-200 shadow-xl shadow-red-950/20 backdrop-blur ${styles.floatingBadge}`}>
              <span className="text-xl">✦</span>
            </div>
          </div>
        </div>

        <div className={`mx-auto w-full max-w-md lg:justify-self-end ${styles.formReveal}`}>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/45 backdrop-blur-xl sm:p-8">
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-red-300/70 to-transparent" aria-hidden="true" />
            <div className="absolute -right-10 -top-10 size-32 rounded-full bg-red-500/15 blur-3xl" aria-hidden="true" />

            <div className="relative">
              <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-950/50">
                <PlayIcon />
              </div>
              <h1 className="mt-5 text-3xl font-black tracking-tight">Welcome back</h1>
              <p className="mt-2 text-sm leading-6 text-slate-400">Sign in to keep building, learning, and sharing.</p>

              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                <label htmlFor="email" className="group block">
                  <span className="mb-2 block text-sm font-semibold text-slate-200">Email address</span>
                  <span className="flex items-center rounded-xl border border-slate-700/90 bg-slate-950/75 px-3 text-slate-500 transition duration-300 group-focus-within:border-red-500/80 group-focus-within:bg-slate-950 group-focus-within:text-red-400 group-focus-within:ring-4 group-focus-within:ring-red-500/10">
                    <MailIcon />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="w-full bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-slate-600"
                    />
                  </span>
                </label>

                <label htmlFor="username" className="group block">
                  <span className="mb-2 block text-sm font-semibold text-slate-200">Username</span>
                  <span className="flex items-center rounded-xl border border-slate-700/90 bg-slate-950/75 px-3 text-slate-500 transition duration-300 group-focus-within:border-red-500/80 group-focus-within:bg-slate-950 group-focus-within:text-red-400 group-focus-within:ring-4 group-focus-within:ring-red-500/10">
                    <UserIcon />
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      autoComplete="username"
                      placeholder="Your DevTube handle"
                      className="w-full bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-slate-600"
                    />
                  </span>
                </label>

                <label htmlFor="password" className="group block">
                  <span className="mb-2 block text-sm font-semibold text-slate-200">Password</span>
                  <span className="flex items-center rounded-xl border border-slate-700/90 bg-slate-950/75 px-3 text-slate-500 transition duration-300 group-focus-within:border-red-500/80 group-focus-within:bg-slate-950 group-focus-within:text-red-400 group-focus-within:ring-4 group-focus-within:ring-red-500/10">
                    <LockIcon />
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className="w-full bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible((visible) => !visible)}
                      className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/8 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400"
                      aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                    >
                      <EyeIcon visible={isPasswordVisible} />
                    </button>
                  </span>
                </label>

                <button
                  type="submit"
                  className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-red-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-950/35 transition duration-300 hover:-translate-y-0.5 hover:bg-red-500 hover:shadow-red-950/60 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-900 active:translate-y-0"
                >
                  <span className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 blur-sm transition-transform duration-700 group-hover:translate-x-[470%]" aria-hidden="true" />
                  <span className="relative">Log in to DevTube</span>
                  <span className="relative transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-400 sm:hidden">
                New here?{" "}
                <Link href="/signup" className="font-semibold text-red-400 transition hover:text-red-300">Create a channel</Link>
              </p>
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-slate-500">
            Your account is protected with secure authentication.
          </p>
        </div>
      </section>
    </main>
  );
}
