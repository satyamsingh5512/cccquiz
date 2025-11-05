'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, Users, Lock } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState([]);

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

  const handleQuizClick = (quizId: string) => {
    router.push(`/quiz/${quizId}`);
  };

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome to Quiz Platform
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Test your knowledge with our interactive quizzes
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl hover:shadow-2xl transition"
          >
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Interactive Quizzes</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Engage with carefully crafted questions across various topics
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl hover:shadow-2xl transition"
          >
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-4">
              <Trophy className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Instant Results</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get immediate feedback and see your score after completing quizzes
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl hover:shadow-2xl transition"
          >
            <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mb-4">
              <Users className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Community Learning</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Join the Cloud Computing Club community and learn together
            </p>
          </motion.div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Available Quizzes</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {quizzes.map((quiz: any, index) => (
              <motion.div
                key={quiz._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:shadow-2xl transition"
              >
                <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {quiz.description}
                </p>
                <button
                  onClick={() => handleQuizClick(quiz._id)}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition"
                >
                  <Lock size={20} />
                  <span>Start Quiz</span>
                </button>
              </motion.div>
            ))}
          </div>
        </div>


      </main>
    </div>
  );
}
