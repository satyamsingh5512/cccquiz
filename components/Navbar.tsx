'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { Moon, Sun, LogOut, Shield, Home, Sparkles } from 'lucide-react';

const navVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function Navbar() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'backdrop-blur-xl bg-white/70 dark:bg-gray-950/70 shadow-lg shadow-blue-500/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-white/40 bg-white/80 shadow-md shadow-blue-500/20 backdrop-blur dark:border-white/10 dark:bg-gray-900/70">
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <Image
                  src="https://www.cloudcomputingclub.co.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fclub_logo.edc6af2c.png&w=64&q=75"
                  alt="Cloud Computing Club logo"
                  fill
                  sizes="44px"
                  priority
                  className="object-contain p-1"
                />
              </motion.div>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Cloud Computing Club
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300">
              <Link
                href="/"
                className="rounded-full px-4 py-2 transition hover:bg-blue-50 dark:hover:bg-gray-800"
              >
                Home
              </Link>
              <Link
                href="/#features"
                className="rounded-full px-4 py-2 transition hover:bg-blue-50 dark:hover:bg-gray-800"
              >
                Features
              </Link>
              <Link
                href="/#quizzes"
                className="rounded-full px-4 py-2 transition hover:bg-blue-50 dark:hover:bg-gray-800"
              >
                Quizzes
              </Link>
            </div>

            {session?.user?.isAdmin ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/admin"
                  className="hidden sm:inline-flex items-center gap-2 rounded-full border border-purple-500/50 px-4 py-2 text-sm font-semibold text-purple-600 transition hover:border-purple-500 hover:bg-purple-50 dark:text-purple-300 dark:hover:bg-purple-500/10"
                >
                  <Shield size={16} />
                  Admin
                </Link>
                <button
                  onClick={() => signOut()}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-blue-500/50"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:shadow-purple-500/50"
              >
                <Shield size={16} />
                Admin Access
              </Link>
            )}

            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-blue-500"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <Link
              href="/#quizzes"
              className="hidden lg:inline-flex items-center gap-2 rounded-full border border-blue-500/60 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
            >
              <Home size={16} />
              Explore
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/30 dark:border-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Sparkles size={14} />
            Elevate your quiz experience with real-time insights.
          </span>
          <Link href="/#features" className="hidden sm:inline text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Discover what&apos;s new →
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
