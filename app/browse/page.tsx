'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export default function BrowsePage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch('/api/quizzes');
      const data = await res.json();
      setQuizzes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            Browse Quizzes
          </h1>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search quizzes..."
              className="w-full rounded-2xl border border-white/40 bg-white/80 pl-12 pr-4 py-4 backdrop-blur-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-gray-900/80"
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="text-center py-12 rounded-3xl border border-white/40 bg-white/80 backdrop-blur-lg dark:border-white/10 dark:bg-gray-900/80">
            <p className="text-gray-600 dark:text-gray-300">
              {searchTerm ? 'No quizzes found matching your search' : 'No quizzes available yet'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredQuizzes.map((quiz) => (
              <motion.div
                key={quiz._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl border border-white/40 bg-white/80 p-6 backdrop-blur-lg transition hover:shadow-xl dark:border-white/10 dark:bg-gray-900/80"
              >
                <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                  {quiz.description}
                </p>
                {(quiz.college || quiz.clubName) && (
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">
                    {quiz.college && quiz.clubName
                      ? `${quiz.college} • ${quiz.clubName}`
                      : quiz.college || quiz.clubName}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {quiz.questionCount || 0} questions
                  </span>
                  <button
                    onClick={() => router.push(`/quiz/${quiz._id}`)}
                    className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:shadow-lg"
                  >
                    Take Quiz
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
