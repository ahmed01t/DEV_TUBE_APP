"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { register as registerUser } from "../lib/auth";
import styles from "./page.module.css";

function PlayIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-current">
      <path d="M8.2 5.2v13.6L19.6 12 8.2 5.2Z" />
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

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-[1.8]">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4.5 7 7.5 5.5L19.5 7" />
    </svg>
  );
}

function AtIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-[1.8]">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15.5 9.2V13a2.2 2.2 0 0 1-4.4 0v-2.2a2.2 2.2 0 1 1 4.4 0v3.1c.5.4 1.8.3 2.4-.3" />
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

function ImageIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-[1.7]">
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <circle cx="8.3" cy="9" r="1.5" />
      <path d="m4.5 18 5.3-5 3.3 3 2.2-2.1 4.2 4.1" />
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

function UploadIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-[1.8]">
      <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14.5V19h14v-4.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-[2.2]">
      <path d="m5 12.5 4.3 4.2L19 7.5" />
    </svg>
  );
}

function passwordScore(password) {
  return [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;
}

export default function SignupPage() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });

  const password = watch("password", "");
  const username = watch("username", "");
  const avatarFile = watch("avatar")?.[0];
  const coverFile = watch("coverImage")?.[0];
  const strength = passwordScore(password);
  const strengthLabel = ["", "Weak", "Fair", "Strong", "Great"][strength];
  const channelName = username.trim() || "your-channel";

  useEffect(() => () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
  }, [avatarPreview]);

  useEffect(() => () => {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
  }, [coverPreview]);

  function updatePreview(event, setPreview) {
    const file = event.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  async function onSubmit(data) {
    setSubmitError("");

    try {
      const formData = new FormData();
      formData.append("fullname", data.fullname);
      formData.append("email", data.email);
      formData.append("username", data.username);
      formData.append("password", data.password);
      formData.append("avatar", data.avatar[0]);

      if (data.coverImage?.length > 0) {
        formData.append("coverImage", data.coverImage[0]);
      }

      await registerUser(formData);
      router.push("/login");
    } catch (error) {
      console.error(error);
      setSubmitError(error.message || "Registration failed. Please try again.");
    }
  }

  const inputClass = (hasError) => `flex items-center rounded-xl border bg-slate-950/75 px-3 text-slate-500 transition duration-300 group-focus-within:bg-slate-950 group-focus-within:ring-4 ${
    hasError
      ? "border-red-500/80 text-red-400 ring-4 ring-red-500/10"
      : "border-slate-700/90 group-focus-within:border-red-500/80 group-focus-within:text-red-400 group-focus-within:ring-red-500/10"
  }`;

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-slate-950 px-5 py-5 text-white sm:px-8 sm:py-8">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className={`absolute -left-24 top-12 size-[28rem] rounded-full bg-red-600/20 blur-3xl ${styles.driftOne}`} />
        <div className={`absolute -right-32 bottom-0 size-[31rem] rounded-full bg-fuchsia-600/20 blur-3xl ${styles.driftTwo}`} />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.055)_1px,transparent_1px)] bg-size-[48px_48px] [mask-image:radial-gradient(ellipse_100%_70%_at_50%_0%,black,transparent)]" />
      </div>

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link href="/" aria-label="DevTube home" className="group flex items-center gap-2 text-xl font-black uppercase tracking-tight sm:text-2xl">
          <span>DEV</span>
          <span className="rounded bg-red-600 px-1.5 py-1 text-sm tracking-wide text-white shadow-lg shadow-red-950/40 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">TUBE</span>
        </Link>
        <p className="text-sm text-slate-400">
          <span className="hidden sm:inline">Already creating? </span>
          <Link href="/login" className="font-semibold text-red-400 transition hover:text-red-300">Log in</Link>
        </p>
      </header>

      <section className="mx-auto grid w-full max-w-7xl items-center gap-12 py-10 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[0.94fr_1fr] lg:py-8">
        <div className={`relative hidden max-w-xl lg:block ${styles.panelReveal}`}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-300 backdrop-blur">
            <span className={`size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_3px_rgba(52,211,153,0.5)] ${styles.pulseDot}`} />
            <span>Your creator journey starts here</span>
          </div>
          <h1 className="max-w-lg text-5xl font-black leading-[0.97] tracking-tight text-white xl:text-6xl">
            Give your ideas a place to <span className="bg-linear-to-r from-red-400 via-rose-300 to-fuchsia-300 bg-size-[200%_auto] bg-clip-text text-transparent animate-[landing-shine_5s_linear_infinite]">take off.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-slate-400">
            Build a developer channel, share what you are learning, and find people who get excited about the same things.
          </p>

          <div className="relative mt-12 h-72 max-w-lg">
            <div className={`absolute left-0 top-6 w-80 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/85 p-3 shadow-2xl shadow-black/30 backdrop-blur ${styles.previewFloat}`}>
              <div className="relative h-28 overflow-hidden rounded-xl bg-linear-to-br from-red-500 via-rose-600 to-fuchsia-700">
                {coverPreview && <img src={coverPreview} alt="Selected cover preview" className="size-full object-cover" />}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.24),transparent_28%)]" />
              </div>
              <div className="relative flex items-end gap-3 px-2 pb-1">
                <div className="-mt-7 grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl border-4 border-slate-900 bg-linear-to-br from-orange-400 to-red-600 text-lg font-black shadow-lg">
                  {avatarPreview ? <img src={avatarPreview} alt="Selected avatar preview" className="size-full object-cover" /> : <span>{channelName.slice(0, 1).toUpperCase()}</span>}
                </div>
                <div className="min-w-0 pt-3">
                  <p className="truncate text-sm font-bold text-white">@{channelName}</p>
                  <p className="text-xs text-slate-400">New DevTube creator</p>
                </div>
              </div>
            </div>

            <div className={`absolute bottom-0 right-0 w-64 rounded-2xl border border-white/10 bg-slate-900/75 p-4 shadow-2xl shadow-black/25 backdrop-blur ${styles.statFloat}`}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Channel kit</p>
                <span className="text-lg text-red-300">✦</span>
              </div>
              <div className="mt-4 space-y-3">
                {["Your channel identity", "A space for every upload", "A community to grow with"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="grid size-5 place-items-center rounded-full bg-emerald-400/15 text-emerald-300"><CheckIcon /></span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className={`absolute left-[55%] top-0 grid size-14 place-items-center rounded-2xl border border-white/15 bg-white/10 text-red-200 shadow-xl shadow-red-950/20 backdrop-blur ${styles.sparkleFloat}`}>
              <span className="text-xl">✦</span>
            </div>
          </div>
        </div>

        <div className={`mx-auto w-full max-w-lg lg:justify-self-end ${styles.formReveal}`}>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/45 backdrop-blur-xl sm:p-8">
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-red-300/70 to-transparent" aria-hidden="true" />
            <div className="absolute -right-10 -top-10 size-32 rounded-full bg-red-500/15 blur-3xl" aria-hidden="true" />

            <div className="relative">
              <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-950/50"><PlayIcon /></div>
              <h1 className="mt-5 text-3xl font-black tracking-tight">Create your channel</h1>
              <p className="mt-2 text-sm leading-6 text-slate-400">A few details now, then you can start sharing what you know.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4" noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label htmlFor="fullname" className="group block">
                    <span className="mb-2 block text-sm font-semibold text-slate-200">Full name</span>
                    <span className={inputClass(errors.fullname)}>
                      <UserIcon />
                      <input id="fullname" type="text" autoComplete="name" placeholder="Ada Lovelace" className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600" {...register("fullname", { required: "Full name is required" })} />
                    </span>
                    {errors.fullname && <p className="mt-1.5 text-xs font-medium text-red-300">{errors.fullname.message}</p>}
                  </label>

                  <label htmlFor="username" className="group block">
                    <span className="mb-2 block text-sm font-semibold text-slate-200">Username</span>
                    <span className={inputClass(errors.username)}>
                      <AtIcon />
                      <input id="username" type="text" autoComplete="username" placeholder="adalovescode" className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600" {...register("username", { required: "Username is required", pattern: { value: /^[a-zA-Z0-9_]+$/, message: "Use letters, numbers, or underscores" } })} />
                    </span>
                    {errors.username && <p className="mt-1.5 text-xs font-medium text-red-300">{errors.username.message}</p>}
                  </label>
                </div>

                <label htmlFor="email" className="group block">
                  <span className="mb-2 block text-sm font-semibold text-slate-200">Email address</span>
                  <span className={inputClass(errors.email)}>
                    <MailIcon />
                    <input id="email" type="email" autoComplete="email" placeholder="you@example.com" className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600" {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" } })} />
                  </span>
                  {errors.email && <p className="mt-1.5 text-xs font-medium text-red-300">{errors.email.message}</p>}
                </label>

                <label htmlFor="password" className="group block">
                  <span className="mb-2 block text-sm font-semibold text-slate-200">Password</span>
                  <span className={inputClass(errors.password)}>
                    <LockIcon />
                    <input id="password" type={isPasswordVisible ? "text" : "password"} autoComplete="new-password" placeholder="Create a secure password" className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Use at least 6 characters" } })} />
                    <button type="button" onClick={() => setIsPasswordVisible((visible) => !visible)} className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/8 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400" aria-label={isPasswordVisible ? "Hide password" : "Show password"}>
                      <EyeIcon visible={isPasswordVisible} />
                    </button>
                  </span>
                  {password && (
                    <div className="mt-2 flex items-center gap-2" aria-live="polite">
                      <div className="flex flex-1 gap-1">
                        {[1, 2, 3, 4].map((level) => <span key={level} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${level <= strength ? (strength < 2 ? "bg-red-400" : strength < 3 ? "bg-amber-400" : "bg-emerald-400") : "bg-slate-700"}`} />)}
                      </div>
                      <span className="w-10 text-right text-xs font-medium text-slate-400">{strengthLabel}</span>
                    </div>
                  )}
                  {errors.password && <p className="mt-1.5 text-xs font-medium text-red-300">{errors.password.message}</p>}
                </label>

                <div className="grid gap-3 sm:grid-cols-[0.86fr_1.14fr]">
                  <label htmlFor="avatar" className={`group relative flex min-h-28 cursor-pointer items-center overflow-hidden rounded-2xl border border-dashed p-3 transition duration-300 hover:-translate-y-0.5 ${errors.avatar ? "border-red-400 bg-red-500/5" : "border-slate-700 bg-slate-950/45 hover:border-red-400/70 hover:bg-red-500/5"}`}>
                    <input id="avatar" type="file" accept="image/*" className="sr-only" {...register("avatar", { required: "An avatar is required", onChange: (event) => updatePreview(event, setAvatarPreview) })} />
                    <div className="flex w-full items-center gap-3">
                      <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-800 text-slate-400 transition group-hover:text-red-300">
                        {avatarPreview ? <img src={avatarPreview} alt="Avatar preview" className="size-full object-cover" /> : <UserIcon />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white">Your avatar</p>
                        <p className="mt-1 truncate text-xs text-slate-500">{avatarFile?.name || "Required · choose image"}</p>
                      </div>
                    </div>
                    <span className="absolute right-3 top-3 text-slate-500 transition group-hover:text-red-300"><UploadIcon /></span>
                  </label>

                  <label htmlFor="coverImage" className="group relative flex min-h-28 cursor-pointer items-center overflow-hidden rounded-2xl border border-dashed border-slate-700 bg-slate-950/45 p-3 transition duration-300 hover:-translate-y-0.5 hover:border-red-400/70 hover:bg-red-500/5">
                    <input id="coverImage" type="file" accept="image/*" className="sr-only" {...register("coverImage", { onChange: (event) => updatePreview(event, setCoverPreview) })} />
                    {coverPreview && <img src={coverPreview} alt="Cover preview" className="absolute inset-0 size-full object-cover opacity-45 transition duration-300 group-hover:opacity-60" />}
                    <div className="relative flex w-full items-center gap-3">
                      <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-slate-800/90 text-slate-400 transition group-hover:text-red-300"><ImageIcon /></div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white">Cover image</p>
                        <p className="mt-1 truncate text-xs text-slate-400">{coverFile?.name || "Optional · make it yours"}</p>
                      </div>
                    </div>
                    <span className="absolute right-3 top-3 text-slate-400 transition group-hover:text-white"><UploadIcon /></span>
                  </label>
                </div>
                {errors.avatar && <p className="-mt-2 text-xs font-medium text-red-300">{errors.avatar.message}</p>}

                {submitError && <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-200" role="alert">{submitError}</p>}

                <button type="submit" disabled={isSubmitting} className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-red-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-950/35 transition duration-300 hover:-translate-y-0.5 hover:bg-red-500 hover:shadow-red-950/60 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0">
                  <span className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 blur-sm transition-transform duration-700 group-hover:translate-x-[470%]" aria-hidden="true" />
                  <span className="relative">{isSubmitting ? "Creating your channel…" : "Create my DevTube channel"}</span>
                  {!isSubmitting && <span className="relative text-lg transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-400">
                Already have a channel? <Link href="/login" className="font-semibold text-red-400 transition hover:text-red-300">Log in</Link>
              </p>
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-slate-500">Your account is protected with secure authentication.</p>
        </div>
      </section>
    </main>
  );
}
