'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { Moon, Sun, LogOut, Shield, Home } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">CC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Cloud Computing Club
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">by Satym</p>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <Home size={18} />
              <span>Home</span>
            </Link>

            {session?.user?.isAdmin && (
              <>
                <Link
                  href="/admin"
                  className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
                >
                  <Shield size={18} />
                  <span>Admin</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            )}

            {!session?.user && (
              <Link
                href="/auth/signin"
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition text-sm"
              >
                Admin Login
              </Link>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
