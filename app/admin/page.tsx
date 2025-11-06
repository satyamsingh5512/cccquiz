'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Plus, List } from 'lucide-react';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [timeLimit, setTimeLimit] = useState(0);
  const [testingDb, setTestingDb] = useState(false);
  const [dbTestResult, setDbTestResult] = useState<any>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated' || (session && !session.user?.isAdmin)) {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch('/api/quizzes');
      const data = await res.json();
      if (Array.isArray(data)) {
        setQuizzes(data);
      } else {
        console.error('Invalid data format:', data);
        setQuizzes([]);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setQuizzes([]);
    }
  };

  const testDatabase = async () => {
    setTestingDb(true);
    setDbTestResult(null);
    try {
      const res = await fetch('/api/test-db');
      const data = await res.json();
      setDbTestResult(data);
    } catch (error) {
      setDbTestResult({
        success: false,
        error: 'Failed to test database',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setTestingDb(false);
    }
  };

  const createQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    const res = await fetch('/api/quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, accessCode, timeLimit: Number(timeLimit) }),
    });

    if (res.ok) {
      setFeedback({ type: 'success', message: 'Quiz created successfully.' });
      setTitle('');
      setDescription('');
      setAccessCode('');
      setTimeLimit(0);
      setShowCreateQuiz(false);
      fetchQuizzes();
    } else {
      const errorData = await res.json().catch(() => ({ error: 'Failed to create quiz' }));
      setFeedback({ type: 'error', message: errorData.error ?? 'Failed to create quiz.' });
    }
  };

  if (status === 'loading') {
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
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage quizzes and questions
          </p>
        </motion.div>

        <div className="mb-8 flex flex-wrap gap-4">
          <button
            onClick={() => {
              setShowCreateQuiz(!showCreateQuiz);
              setFeedback(null);
            }}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition"
          >
            <Plus size={20} />
            <span>Create New Quiz</span>
          </button>
          <button
            onClick={() => router.push('/admin/results')}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition"
          >
            <List size={20} />
            <span>View All Results</span>
          </button>
          <button
            onClick={testDatabase}
            disabled={testingDb}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Database size={20} />
            <span>{testingDb ? 'Testing...' : 'Test Database'}</span>
          </button>
        </div>

        {dbTestResult && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 p-6 rounded-2xl shadow-xl ${
              dbTestResult.success
                ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
                : 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className={`text-xl font-bold ${
                dbTestResult.success ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
              }`}>
                {dbTestResult.success ? '✅ Database Connected' : '❌ Database Connection Failed'}
              </h3>
              <button
                onClick={() => setDbTestResult(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            
            {dbTestResult.success ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Message:</strong> {dbTestResult.message}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Response Time:</strong> {dbTestResult.stats.responseTime}
                </p>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{dbTestResult.stats.quizzes}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Quizzes</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{dbTestResult.stats.questions}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Questions</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{dbTestResult.stats.attempts}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Attempts</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Collections: {dbTestResult.stats.collections.join(', ')}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-red-700 dark:text-red-400">
                  <strong>Error:</strong> {dbTestResult.error}
                </p>
                <p className="text-sm text-red-600 dark:text-red-300 font-mono bg-red-100 dark:bg-red-900/30 p-3 rounded">
                  {dbTestResult.details}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Check your MONGODB_URI environment variable in Vercel settings.
                </p>
              </div>
            )}
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              Tested at: {new Date(dbTestResult.timestamp).toLocaleString()}
            </p>
          </motion.div>
        )}

        {showCreateQuiz && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 mb-8 shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-4">Create New Quiz</h2>
            <form onSubmit={createQuiz} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Access Code (leave empty for auto-generated)
                </label>
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  placeholder="e.g., QUIZ123"
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Users will need this code to access the quiz
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  placeholder="0 for no limit"
                  min="0"
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Set to 0 for no time limit. Users will see a countdown timer.
                </p>
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Create Quiz
              </button>
            </form>
            {feedback && (
              <div
                className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
                  feedback.type === 'success'
                    ? 'border-green-500/40 bg-green-50 text-green-700 dark:border-green-400/30 dark:bg-green-900/20 dark:text-green-300'
                    : 'border-red-500/40 bg-red-50 text-red-700 dark:border-red-400/30 dark:bg-red-900/20 dark:text-red-300'
                }`}
              >
                {feedback.message}
              </div>
            )}
          </motion.div>
        )}

        <div className="grid gap-6">
          {quizzes.map((quiz: any, index) => (
            <motion.div
              key={quiz._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:shadow-2xl transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{quiz.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {quiz.description}
                  </p>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-gray-500">Access Code:</span>
                    <code className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded font-mono font-bold">
                      {quiz.accessCode}
                    </code>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-gray-500">Time Limit:</span>
                    <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded font-semibold">
                      {quiz.timeLimit > 0 ? `${quiz.timeLimit} minutes` : 'No limit'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(quiz.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => router.push(`/admin/quiz/${quiz._id}`)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <List size={18} />
                    <span>Manage Questions</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
