"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FormEvent,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type NavBarProps = {
  profileName?: string;
  profileUsername?: string;
  profileImageUrl?: string;
  onLogout?: () => void | Promise<void>;
  onSearch?: (query: string) => void;
};

const navigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/upload", label: "Upload" },
  { href: "/studio", label: "Studio" },
  { href: "/history", label: "History" },
];

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      {open ? <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" /> : <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />}
    </svg>
  );
}

export default function NavBar({
  profileName = "DevTube user",
  profileUsername,
  profileImageUrl,
  onLogout,
  onSearch,
}: NavBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    const shouldUseDarkTheme = savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;

    setIsDark(shouldUseDarkTheme);
    document.documentElement.classList.toggle("dark", shouldUseDarkTheme);
  }, []);

  useEffect(() => {
    function closeProfileMenu(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", closeProfileMenu);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeProfileMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  function toggleTheme() {
    const nextThemeIsDark = !isDark;
    setIsDark(nextThemeIsDark);
    document.documentElement.classList.toggle("dark", nextThemeIsDark);
    window.localStorage.setItem("theme", nextThemeIsDark ? "dark" : "light");
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;

    if (onSearch) {
      onSearch(trimmedQuery);
    } else {
      router.push(`/dashboard?search=${encodeURIComponent(trimmedQuery)}`);
    }

    setIsMobileMenuOpen(false);
  }

  async function handleLogout(event: ReactMouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setIsProfileMenuOpen(false);

    if (onLogout) {
      await onLogout();
      return;
    }

    router.push("/login");
  }

  const initials = profileName.trim().charAt(0).toUpperCase() || "D";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <nav className="flex min-h-16 w-full items-center gap-3 px-4 sm:px-6 lg:px-8" aria-label="Primary navigation">
        <Link
          href="/"
          aria-label="DevTube home"
          className="flex shrink-0 items-center text-2xl font-black uppercase leading-none tracking-tight text-slate-950 transition-opacity hover:opacity-80 dark:text-white"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <span>DEV</span>
          <span className="ml-1 rounded bg-red-600 px-1.5 py-1 text-base tracking-wide text-white shadow-sm">TUBE</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive ? "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <form className="mx-auto hidden w-full max-w-md md:block" onSubmit={handleSearch} role="search">
          <label className="sr-only" htmlFor="site-search">
            Search videos
          </label>
          <div className="relative">
            <input
              id="site-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search videos"
              className="w-full rounded-full border border-slate-300 bg-slate-50 py-2 pl-4 pr-11 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
            />
            <button type="submit" aria-label="Search" className="absolute inset-y-0 right-0 grid w-10 place-items-center rounded-r-full text-slate-500 transition hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400">
              <SearchIcon />
            </button>
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            className="grid size-10 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label={isDark ? "Use light mode" : "Use dark mode"}
            title={isDark ? "Use light mode" : "Use dark mode"}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((open) => !open)}
              aria-expanded={isProfileMenuOpen}
              aria-haspopup="menu"
              className="grid size-10 place-items-center overflow-hidden rounded-full bg-red-600 text-sm font-bold text-white ring-offset-2 transition hover:ring-2 hover:ring-red-500 dark:ring-offset-slate-950"
            >
              {profileImageUrl ? <img src={profileImageUrl} alt={`${profileName}'s profile`} className="size-full object-cover" /> : initials}
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900" role="menu">
                <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                  <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">{profileName}</p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">{profileUsername ? `@${profileUsername}` : "Your account"}</p>
                </div>
                <Link href="/account" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" role="menuitem">Account settings</Link>
                <Link href="/subscriptions" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" role="menuitem">Subscriptions</Link>
                {profileUsername && <Link href={`/channel/${profileUsername}`} onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" role="menuitem">My channel</Link>}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                  role="menuitem"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="grid size-10 place-items-center rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label="Toggle navigation menu"
          >
            <MenuIcon open={isMobileMenuOpen} />
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div id="mobile-navigation" className="border-t border-slate-200 px-4 py-3 dark:border-slate-800 md:hidden">
          <form className="mb-3" onSubmit={handleSearch} role="search">
            <label className="sr-only" htmlFor="mobile-site-search">
              Search videos
            </label>
            <div className="relative">
              <input
                id="mobile-site-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search videos"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2 pl-3 pr-10 text-sm text-slate-950 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
              <button type="submit" aria-label="Search" className="absolute inset-y-0 right-0 grid w-10 place-items-center text-slate-500 dark:text-slate-400">
                <SearchIcon />
              </button>
            </div>
          </form>
          <div className="grid gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium ${pathname === item.href ? "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300" : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
