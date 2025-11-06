'use client';

import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-auto py-6 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Made with ❤️ by</span>
          <a
            href="https://github.com/satyamsingh5512/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition group"
          >
            <span>satym._.</span>
            <Github size={16} className="group-hover:scale-110 transition-transform" />
          </a>
        </div>
      </div>
    </footer>
  );
}
