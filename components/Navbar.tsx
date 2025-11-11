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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="relative h-9 w-9 sm:h-11 sm:w-11 overflow-hidden rounded-xl border border-white/40 bg-white shadow-md shadow-blue-500/20 backdrop-blur dark:border-white/10 dark:bg-gray-900">
              <motion.div
                className="absolute inset-0 flex items-center justify-center p-1"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <Image
                  src="/logo.png"
                  alt="Quizo Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </motion.div>
            </div>
            <div className="hidden xs:block">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Quizo
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
            <div className="hidden lg:flex items-center gap-0.5 text-xs xl:text-sm font-medium text-gray-600 dark:text-gray-300">
              <Link
                href="/"
                className="rounded-full px-2 xl:px-4 py-1.5 xl:py-2 transition hover:bg-blue-50 dark:hover:bg-gray-800 whitespace-nowrap"
              >
                Home
              </Link>
              <Link
                href="/#features"
                className="rounded-full px-2 xl:px-4 py-1.5 xl:py-2 transition hover:bg-blue-50 dark:hover:bg-gray-800 whitespace-nowrap"
              >
                Features
              </Link>
              <Link
                href="/#quizzes"
                className="rounded-full px-2 xl:px-4 py-1.5 xl:py-2 transition hover:bg-blue-50 dark:hover:bg-gray-800 whitespace-nowrap"
              >
                Quizzes
              </Link>
            </div>

            {session ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  href="/dashboard"
                  className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-blue-500/50 px-2.5 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold text-blue-600 transition hover:border-blue-500 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-500/10 whitespace-nowrap"
                >
                  <Home size={14} className="lg:w-4 lg:h-4" />
                  <span className="hidden lg:inline">Dashboard</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-2.5 sm:px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-blue-500/50 whitespace-nowrap"
                >
                  <LogOut size={14} className="lg:w-4 lg:h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:shadow-purple-500/50 whitespace-nowrap"
              >
                <Shield size={14} className="sm:w-4 sm:h-4" />
                Login
              </Link>
            )}

            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-blue-500 flex-shrink-0"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Sun size={16} className="sm:w-[18px] sm:h-[18px]" />}
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/30 dark:border-white/5 hidden md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 py-1.5 sm:py-2 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1 truncate">
            <Sparkles size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            <span className="truncate">Elevate your quiz experience with real-time insights.</span>
          </span>
          <Link href="/#features" className="hidden lg:inline text-blue-600 hover:text-blue-500 dark:text-blue-400 whitespace-nowrap flex-shrink-0">
            Discover what&apos;s new →
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
