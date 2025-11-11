'use client';

import { useEffect, useState } from 'react';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';

export default function LeaderboardsPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch leaderboard data from API
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Leaderboards
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Top performers across all quizzes
          </p>
        </motion.div>

        <div className="rounded-3xl border border-white/40 bg-white/80 p-8 backdrop-blur-lg dark:border-white/10 dark:bg-gray-900/80">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600 dark:text-gray-300">
                No leaderboard data available yet
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Complete quizzes to see rankings here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {leaderboard.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{entry.name}</h3>
                    <p className="text-sm text-gray-500">{entry.score} points</p>
                  </div>
                  {index === 0 && <Trophy className="text-yellow-500" size={24} />}
                  {index === 1 && <Medal className="text-gray-400" size={24} />}
                  {index === 2 && <Award className="text-orange-500" size={24} />}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
