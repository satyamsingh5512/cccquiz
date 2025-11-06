'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';

export default function ManageQuizPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const quizId = params.quizId as string;

  const [questions, setQuestions] = useState([]);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated' || (session && !session.user?.isAdmin)) {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (quizId) {
      fetchQuestions();
    }
  }, [quizId]);

  const fetchQuestions = async () => {
    const res = await fetch(`/api/questions/${quizId}`);
    const data = await res.json();
    setQuestions(data);
  };

  const addQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        options,
        correctAnswer,
        quizId,
      }),
    });

    if (res.ok) {
      setQuestion('');
      setOptions(['', '', '', '']);
      setCorrectAnswer(0);
      setShowAddQuestion(false);
      fetchQuestions();
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
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
          <button
            onClick={() => router.push('/admin')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Admin Dashboard</span>
          </button>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Manage Questions
          </h1>
        </motion.div>

        <div className="mb-8">
          <button
            onClick={() => setShowAddQuestion(!showAddQuestion)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition"
          >
            <Plus size={20} />
            <span>Add Question</span>
          </button>
        </div>

        {showAddQuestion && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 mb-8 shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-4">Add New Question</h2>
            <form onSubmit={addQuestion} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Question</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
                  rows={3}
                  required
                />
              </div>

              {options.map((option, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium mb-2">
                    Option {index + 1}
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={correctAnswer === index}
                      onChange={() => setCorrectAnswer(index)}
                      className="w-4 h-4"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder={`Enter option ${index + 1}`}
                      required
                    />
                  </div>
                </div>
              ))}

              <p className="text-sm text-gray-500">
                Select the radio button next to the correct answer
              </p>

              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Add Question
              </button>
            </form>
          </motion.div>
        )}

        <div className="space-y-6">
          {questions.map((q: any, index) => (
            <motion.div
              key={q._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold flex-1">
                  {index + 1}. {q.question}
                </h3>
              </div>
              <div className="space-y-2">
                {q.options.map((option: string, optIndex: number) => (
                  <div
                    key={optIndex}
                    className={`px-4 py-2 rounded-lg ${
                      optIndex === q.correctAnswer
                        ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500'
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                  >
                    {option}
                    {optIndex === q.correctAnswer && (
                      <span className="ml-2 text-green-600 dark:text-green-400 font-semibold">
                        ✓ Correct
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
