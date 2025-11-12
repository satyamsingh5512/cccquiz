'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Users, 
  FileText, 
  Clock, 
  Edit, 
  Trash2, 
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function ManageQuizPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const quizId = params.quizId as string;

  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchQuizData();
    }
  }, [status, quizId]);

  const fetchQuizData = async () => {
    try {
      const [quizRes, questionsRes, attemptsRes] = await Promise.all([
        fetch(`/api/quizzes/${quizId}`),
        fetch(`/api/questions/${quizId}`),
        fetch(`/api/attempts?quizId=${quizId}`),
      ]);

      if (!quizRes.ok) {
        console.error('Failed to fetch quiz:', await quizRes.text());
        setQuiz(null);
        return;
      }

      const quizData = await quizRes.json();
      const questionsData = questionsRes.ok ? await questionsRes.json() : [];
      const attemptsData = attemptsRes.ok ? await attemptsRes.json() : [];

      if (process.env.NODE_ENV === 'development') {
        console.log('Quiz data:', quizData);
        console.log('Questions:', questionsData);
        console.log('Attempts:', attemptsData);
      }

      setQuiz(quizData);
      setQuestions(Array.isArray(questionsData) ? questionsData : []);
      setAttempts(Array.isArray(attemptsData) ? attemptsData : []);
    } catch (error) {
      console.error('Error fetching quiz data:', error);
      setQuiz(null);
    } finally {
      setLoading(false);
    }
  };

  const copyAccessCode = () => {
    if (quiz?.accessCode) {
      navigator.clipboard.writeText(quiz.accessCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyQuizLink = () => {
    const link = `${window.location.origin}/quiz/${quizId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedBackground />
        <Navbar />
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Not Found</h2>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const averageScore = attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + (a.score / a.totalQuestions) * 100, 0) / attempts.length)
    : 0;

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <button
              onClick={() => router.push('/my-quizzes')}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 mb-4"
            >
              ← Back to My Quizzes
            </button>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {quiz.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">{quiz.description}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="rounded-3xl border border-white/40 bg-white/80 p-6 backdrop-blur-lg dark:border-white/10 dark:bg-gray-900/80">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Questions</p>
                  <p className="text-3xl font-bold">{questions.length}</p>
                </div>
                <FileText className="h-12 w-12 text-blue-500" />
              </div>
            </div>

            <div className="rounded-3xl border border-white/40 bg-white/80 p-6 backdrop-blur-lg dark:border-white/10 dark:bg-gray-900/80">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Participants</p>
                  <p className="text-3xl font-bold">{attempts.length}</p>
                </div>
                <Users className="h-12 w-12 text-green-500" />
              </div>
            </div>

            <div className="rounded-3xl border border-white/40 bg-white/80 p-6 backdrop-blur-lg dark:border-white/10 dark:bg-gray-900/80">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Avg Score</p>
                  <p className="text-3xl font-bold">{averageScore}%</p>
                </div>
                <CheckCircle className="h-12 w-12 text-purple-500" />
              </div>
            </div>

            <div className="rounded-3xl border border-white/40 bg-white/80 p-6 backdrop-blur-lg dark:border-white/10 dark:bg-gray-900/80">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Timer</p>
                  <p className="text-xl font-bold">
                    {quiz.timerType === 'none' && 'No Limit'}
                    {quiz.timerType === 'whole' && `${quiz.timeLimit} min`}
                    {quiz.timerType === 'perQuestion' && `${quiz.perQuestionTime}s/Q`}
                  </p>
                </div>
                <Clock className="h-12 w-12 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Access Code & Link */}
          <div className="rounded-3xl border border-white/40 bg-white/80 p-8 backdrop-blur-lg dark:border-white/10 dark:bg-gray-900/80 mb-8">
            <h2 className="text-2xl font-bold mb-6">Quiz Access</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">Access Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={quiz.accessCode}
                    readOnly
                    className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 font-mono text-lg dark:border-gray-600 dark:bg-gray-800"
                  />
                  <button
                    onClick={copyAccessCode}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Quiz Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/quiz/${quizId}`}
                    readOnly
                    className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm dark:border-gray-600 dark:bg-gray-800 truncate"
                  />
                  <button
                    onClick={copyQuizLink}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Copy size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <button
              onClick={() => router.push(`/quiz/${quizId}`)}
              className="flex items-center justify-center gap-2 rounded-lg border border-blue-600 px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Eye size={20} />
              Preview Quiz
            </button>
            <button
              onClick={() => router.push(`/admin/quiz/${quizId}`)}
              className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition hover:shadow-lg"
            >
              <Edit size={20} />
              Edit Quiz
            </button>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this quiz?')) {
                  // TODO: Implement delete
                  alert('Delete functionality coming soon!');
                }
              }}
              className="flex items-center justify-center gap-2 rounded-lg border border-red-600 px-6 py-3 font-semibold text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 size={20} />
              Delete Quiz
            </button>
          </div>

          {/* Recent Attempts */}
          <div className="rounded-3xl border border-white/40 bg-white/80 p-8 backdrop-blur-lg dark:border-white/10 dark:bg-gray-900/80">
            <h2 className="text-2xl font-bold mb-6">Recent Attempts</h2>
            {attempts.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">No attempts yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Roll Number</th>
                      <th className="text-center py-3 px-4">Score</th>
                      <th className="text-center py-3 px-4">Percentage</th>
                      <th className="text-left py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attempts.slice(0, 10).map((attempt, index) => {
                      const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
                      return (
                        <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-3 px-4">{attempt.userName}</td>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{attempt.userEmail}</td>
                          <td className="py-3 px-4">{attempt.rollNumber}</td>
                          <td className="text-center py-3 px-4 font-semibold">
                            {attempt.score}/{attempt.totalQuestions}
                          </td>
                          <td className="text-center py-3 px-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                              percentage >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                              percentage >= 60 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                              percentage >= 40 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                            }`}>
                              {percentage}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                            {new Date(attempt.submittedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
