"use client";

import { useState } from "react";
import AppShell, { useSession } from "../components/AppShell";
import { changePassword, updateAccount, updateAvatar } from "../lib/api";

function AccountContent() {
  const { user, setUser } = useSession();
  const [fullname, setFullname] = useState(user.fullname || "");
  const [email, setEmail] = useState(user.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function saveDetails(event) {
    event.preventDefault();
    setIsSaving(true); setError(""); setMessage("");
    try { const updated = await updateAccount({ fullname, email }); setUser(updated); setMessage("Account details saved."); } catch (requestError) { setError(requestError.message); } finally { setIsSaving(false); }
  }

  async function savePassword(event) {
    event.preventDefault();
    setIsSaving(true); setError(""); setMessage("");
    try { await changePassword({ oldPassword, newPassword }); setOldPassword(""); setNewPassword(""); setMessage("Password changed successfully."); } catch (requestError) { setError(requestError.message); } finally { setIsSaving(false); }
  }

  async function saveAvatar(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsSaving(true); setError(""); setMessage("");
    try { const formData = new FormData(); formData.append("avatar", file); const updated = await updateAvatar(formData); setUser(updated); setMessage("Profile image updated."); } catch (requestError) { setError(requestError.message); } finally { setIsSaving(false); }
  }

  return <main className="mx-auto w-full max-w-4xl px-4 py-9 sm:px-6"><p className="text-sm font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">Account</p><h1 className="mt-2 text-4xl font-black tracking-tight">Settings</h1><p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Keep your channel identity and sign-in details current.</p>{message && <p className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200">{message}</p>}{error && <p className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">{error}</p>}<div className="mt-8 grid gap-6 lg:grid-cols-[0.72fr_1.28fr]"><aside className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><div className="grid size-24 place-items-center overflow-hidden rounded-full bg-red-600 text-3xl font-black text-white">{user.avatar ? <img src={user.avatar} alt="Your avatar" className="size-full object-cover" /> : user.fullname?.slice(0, 1)}</div><p className="mt-4 text-lg font-black">{user.fullname}</p><p className="text-sm text-slate-500">@{user.username}</p><label className="mt-5 inline-flex cursor-pointer rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold transition hover:border-red-400 hover:text-red-600 dark:border-slate-700 dark:hover:text-red-400">{isSaving ? "Updating…" : "Change avatar"}<input type="file" accept="image/*" className="sr-only" onChange={saveAvatar} disabled={isSaving} /></label></aside><div className="space-y-6"><form onSubmit={saveDetails} className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><h2 className="text-xl font-black">Profile details</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="block text-sm font-bold">Full name<input value={fullname} onChange={(event) => setFullname(event.target.value)} required className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 dark:border-slate-700 dark:bg-slate-950" /></label><label className="block text-sm font-bold">Email<input value={email} onChange={(event) => setEmail(event.target.value)} required type="email" className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 dark:border-slate-700 dark:bg-slate-950" /></label></div><button disabled={isSaving} className="mt-5 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-500 disabled:opacity-70">Save details</button></form><form onSubmit={savePassword} className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><h2 className="text-xl font-black">Password</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="block text-sm font-bold">Current password<input value={oldPassword} onChange={(event) => setOldPassword(event.target.value)} required type="password" className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 dark:border-slate-700 dark:bg-slate-950" /></label><label className="block text-sm font-bold">New password<input value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required minLength={6} type="password" className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 dark:border-slate-700 dark:bg-slate-950" /></label></div><button disabled={isSaving} className="mt-5 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold transition hover:border-red-400 hover:text-red-600 dark:border-slate-700 dark:hover:text-red-400">Change password</button></form></div></div></main>;
}

export default function AccountPage() { return <AppShell><AccountContent /></AppShell>; }
