'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function MyQuizzesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchQuizzes();
    }
  }, [status, router]);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch('/api/quizzes/my-quizzes');
      const data = await res.json();
      setQuizzes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

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
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Quizzes
            </h1>
            <button
              onClick={() => router.push('/create-quiz')}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition hover:shadow-lg"
            >
              <Plus size={20} />
              Create Quiz
            </button>
          </div>
        </motion.div>

        {quizzes.length === 0 ? (
          <div className="text-center py-12 rounded-3xl border border-white/40 bg-white/80 backdrop-blur-lg dark:border-white/10 dark:bg-gray-900/80">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You haven't created any quizzes yet
            </p>
            <button
              onClick={() => router.push('/create-quiz')}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition hover:shadow-lg"
            >
              <Plus size={20} />
              Create Your First Quiz
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <motion.div
                key={quiz._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl border border-white/40 bg-white/80 p-6 backdrop-blur-lg dark:border-white/10 dark:bg-gray-900/80"
              >
                <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                  {quiz.description}
                </p>
                {quiz.accessCode && (
                  <div className="mb-3 inline-block rounded-lg bg-blue-100 dark:bg-blue-900/30 px-3 py-1">
                    <span className="text-xs font-semibold text-blue-800 dark:text-blue-300">
                      Code: {quiz.accessCode}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-gray-500">
                    {quiz.participantCount || 0} participants
                  </span>
                  <span className="text-gray-500">
                    {quiz.questionCount || 0} questions
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/quiz/${quiz._id}`)}
                    className="flex-1 rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    View
                  </button>
                  <button
                    onClick={() => router.push(`/admin/quiz/${quiz._id}`)}
                    className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:shadow-lg"
                  >
                    Manage
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
