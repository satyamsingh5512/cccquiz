'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Search, Trophy } from 'lucide-react';

export default function ResultsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [attempts, setAttempts] = useState([]);
  const [filteredAttempts, setFilteredAttempts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterQuiz, setFilterQuiz] = useState('all');
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    if (status === 'unauthenticated' || (session && !session.user?.isAdmin)) {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    fetchAttempts();
    fetchQuizzes();
  }, []);

  useEffect(() => {
    filterResults();
  }, [searchTerm, filterQuiz, attempts]);

  const fetchAttempts = async () => {
    const res = await fetch('/api/attempts');
    const data = await res.json();
    setAttempts(data);
    setFilteredAttempts(data);
  };

  const fetchQuizzes = async () => {
    const res = await fetch('/api/quizzes');
    const data = await res.json();
    setQuizzes(data);
  };

  const filterResults = () => {
    let filtered = attempts;

    if (filterQuiz !== 'all') {
      filtered = filtered.filter((a: any) => a.quizId === filterQuiz);
    }

    if (searchTerm) {
      filtered = filtered.filter((a: any) =>
        a.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAttempts(filtered);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Roll Number', 'Quiz', 'Score', 'Total', 'Percentage', 'Date'];
    const rows = filteredAttempts.map((a: any) => [
      a.userName,
      a.userEmail,
      a.rollNumber,
      a.quizTitle || 'N/A',
      a.score,
      a.totalQuestions,
      `${Math.round((a.score / a.totalQuestions) * 100)}%`,
      new Date(a.completedAt).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.push('/admin')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Admin Dashboard</span>
          </button>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Quiz Results & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            View and manage all quiz attempts
          </p>
        </motion.div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl mb-8">
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <p className="text-sm opacity-90 mb-1">Total Attempts</p>
              <p className="text-4xl font-bold">{attempts.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
              <p className="text-sm opacity-90 mb-1">Avg Score</p>
              <p className="text-4xl font-bold">
                {attempts.length > 0
                  ? Math.round(
                      attempts.reduce((acc: number, a: any) => acc + (a.score / a.totalQuestions) * 100, 0) /
                        attempts.length
                    )
                  : 0}%
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <p className="text-sm opacity-90 mb-1">Unique Users</p>
              <p className="text-4xl font-bold">
                {new Set(attempts.map((a: any) => a.userEmail)).size}
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white">
              <p className="text-sm opacity-90 mb-1">Active Quizzes</p>
              <p className="text-4xl font-bold">{quizzes.length}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or roll number..."
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <select
              value={filterQuiz}
              onChange={(e) => setFilterQuiz(e.target.value)}
              className="px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="all">All Quizzes</option>
              {quizzes.map((quiz: any) => (
                <option key={quiz._id} value={quiz._id}>
                  {quiz.title}
                </option>
              ))}
            </select>
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Download size={20} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Roll No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Quiz</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Score</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Percentage</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAttempts.map((attempt: any, index) => {
                  const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
                  return (
                    <motion.tr
                      key={attempt._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium">{attempt.userName}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {attempt.userEmail}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono">
                        {attempt.rollNumber}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {attempt.quizTitle || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold">
                          {attempt.score}/{attempt.totalQuestions}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2 max-w-[100px]">
                            <div
                              className={`h-2 rounded-full ${
                                percentage >= 80
                                  ? 'bg-green-500'
                                  : percentage >= 60
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold">{percentage}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {new Date(attempt.completedAt).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredAttempts.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 dark:text-gray-400">No results found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
