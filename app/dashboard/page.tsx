'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Plus, List, Search, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [myQuizzes, setMyQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user?.isAdmin) {
      router.push('/admin');
    } else if (session && !session.user?.organization) {
      router.push('/onboarding');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchMyQuizzes();
    }
  }, [session]);

  const fetchMyQuizzes = async () => {
    try {
      const res = await fetch('/api/quizzes/my-quizzes');
      const data = await res.json();
      setMyQuizzes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || !session) {
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
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome, {session.user.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {session.user.organization}
          </p>
        </motion.div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() => router.push('/create-quiz')}
            className="flex items-center justify-center gap-3 rounded-2xl border border-white/40 bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-xl transition hover:shadow-2xl"
          >
            <Plus size={24} />
            <span className="font-semibold">Create Quiz</span>
          </button>

          <button
            onClick={() => router.push('/browse')}
            className="flex items-center justify-center gap-3 rounded-2xl border border-white/40 bg-white/80 p-6 backdrop-blur-lg transition hover:bg-white dark:border-white/10 dark:bg-gray-900/80 dark:hover:bg-gray-900"
          >
            <Search size={24} className="text-blue-600" />
            <span className="font-semibold">Browse Quizzes</span>
          </button>

          <button
            onClick={() => router.push('/my-quizzes')}
            className="flex items-center justify-center gap-3 rounded-2xl border border-white/40 bg-white/80 p-6 backdrop-blur-lg transition hover:bg-white dark:border-white/10 dark:bg-gray-900/80 dark:hover:bg-gray-900"
          >
            <List size={24} className="text-purple-600" />
            <span className="font-semibold">My Quizzes</span>
          </button>

          <button
            onClick={() => router.push('/leaderboards')}
            className="flex items-center justify-center gap-3 rounded-2xl border border-white/40 bg-white/80 p-6 backdrop-blur-lg transition hover:bg-white dark:border-white/10 dark:bg-gray-900/80 dark:hover:bg-gray-900"
          >
            <TrendingUp size={24} className="text-green-600" />
            <span className="font-semibold">Leaderboards</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl border border-white/40 bg-white/80 p-8 backdrop-blur-lg dark:border-white/10 dark:bg-gray-900/80"
        >
          <h2 className="text-2xl font-bold mb-6">My Recent Quizzes</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            </div>
          ) : myQuizzes.length === 0 ? (
            <div className="text-center py-12">
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
            <div className="grid gap-4 md:grid-cols-2">
              {myQuizzes.slice(0, 4).map((quiz) => (
                <div
                  key={quiz._id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                  <h3 className="text-lg font-semibold mb-2">{quiz.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {quiz.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {quiz.participantCount || 0} participants
                    </span>
                    <button
                      onClick={() => router.push(`/quiz/${quiz._id}/manage`)}
                      className="text-blue-600 hover:text-blue-500 font-semibold"
                    >
                      Manage →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
