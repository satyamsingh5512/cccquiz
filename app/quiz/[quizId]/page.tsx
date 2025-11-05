'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, User, Clock, AlertCircle } from 'lucide-react';

export default function TakeQuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.quizId as string;

  const [questions, setQuestions] = useState<any[]>([]);
  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [showAccessCodeInput, setShowAccessCodeInput] = useState(true);
  const [showUserInfoInput, setShowUserInfoInput] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timerExpired, setTimerExpired] = useState(false);

  useEffect(() => {
    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  const fetchQuiz = async () => {
    try {
      const res = await fetch(`/api/quizzes/${quizId}`);
      const data = await res.json();
      if (data.error) {
        console.error('Error fetching quiz:', data.error);
        setCodeError('Quiz not found');
      } else {
        setQuiz(data);
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
      setCodeError('Failed to load quiz');
    }
  };

  const fetchQuestions = async () => {
    const res = await fetch(`/api/questions/${quizId}`);
    const data = await res.json();
    setQuestions(data);
  };

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    const answersArray = questions.map((q) => ({
      questionId: q._id,
      selectedAnswer: answers[q._id] ?? -1,
    }));

    questions.forEach((q) => {
      if (answers[q._id] === q.correctAnswer) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setShowResults(true);

    await fetch('/api/attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quizId,
        quizTitle: quiz?.title,
        userName,
        userEmail,
        rollNumber,
        answers: answersArray,
        score: correctCount,
        totalQuestions: questions.length,
      }),
    });
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quiz && quiz.accessCode === accessCode.toUpperCase()) {
      setShowAccessCodeInput(false);
      setShowUserInfoInput(true);
      setCodeError('');
      await fetchQuestions();
    } else {
      setCodeError('Invalid access code. Please try again.');
    }
  };

  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim() && userEmail.trim() && rollNumber.trim()) {
      setShowUserInfoInput(false);
      // Start timer if quiz has time limit
      if (quiz?.timeLimit && quiz.timeLimit > 0) {
        setTimeLeft(quiz.timeLimit * 60); // Convert minutes to seconds
      }
    }
  };

  // Timer effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || showResults) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          setTimerExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResults]);

  // Auto-submit when timer expires
  useEffect(() => {
    if (timerExpired && !showResults) {
      handleSubmit();
    }
  }, [timerExpired]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!quiz && !codeError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedBackground />
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (codeError && !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedBackground />
        <Navbar />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl p-12 max-w-md w-full mx-4 shadow-2xl text-center"
        >
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold mb-4">Quiz Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{codeError}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  if (showAccessCodeInput) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedBackground />
        <Navbar />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl p-12 max-w-md w-full mx-4 shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-3xl">🔐</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">{quiz.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Enter the access code to continue
            </p>
          </div>
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              placeholder="Enter access code"
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none text-center text-lg font-mono uppercase"
              required
              autoFocus
            />
            {codeError && (
              <p className="text-red-500 text-sm text-center">{codeError}</p>
            )}
            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition text-lg font-semibold"
            >
              Verify Code
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="w-full px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Back to Home
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (showUserInfoInput) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedBackground />
        <Navbar />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl p-12 max-w-md w-full mx-4 shadow-2xl"
        >
          <div className="text-center mb-8">
            <User className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h2 className="text-3xl font-bold mb-2">Your Information</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Please provide your details to start the quiz
            </p>
            {quiz?.timeLimit && quiz.timeLimit > 0 && (
              <div className="mt-4 flex items-center justify-center space-x-2 text-orange-600 dark:text-orange-400">
                <Clock size={20} />
                <span className="font-semibold">
                  Time Limit: {quiz.timeLimit} minutes
                </span>
              </div>
            )}
          </div>
          <form onSubmit={handleStartQuiz} className="space-y-4">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              required
              autoFocus
            />
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="Roll Number / ID"
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition text-lg font-semibold"
            >
              Start Quiz
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (questions.length === 0 && !showAccessCodeInput && !showUserInfoInput) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedBackground />
        <Navbar />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl p-12 max-w-md w-full mx-4 shadow-2xl text-center"
        >
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl">📝</span>
          </div>
          <h2 className="text-2xl font-bold mb-4">No Questions Yet</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This quiz doesn't have any questions yet. Please contact the admin.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen">
        <AnimatedBackground />
        <Navbar />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl p-12 shadow-2xl text-center"
          >
            {timerExpired ? (
              <AlertCircle className="w-24 h-24 text-orange-500 mx-auto mb-6" />
            ) : (
              <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            )}
            <h1 className="text-4xl font-bold mb-4">
              {timerExpired ? 'Time Expired!' : 'Quiz Completed!'}
            </h1>
            {timerExpired && (
              <p className="text-lg text-orange-600 dark:text-orange-400 mb-4">
                The quiz was automatically submitted when time ran out.
              </p>
            )}
            <div className="mb-8">
              <p className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {percentage}%
              </p>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                You scored {score} out of {questions.length}
              </p>
            </div>
            <div className="space-x-4">
              <button
                onClick={() => router.push('/')}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition"
              >
                Back to Home
              </button>
              <button
                onClick={() => {
                  setCurrentQuestion(0);
                  setAnswers({});
                  setShowResults(false);
                  setScore(0);
                  setShowAccessCodeInput(true);
                  setShowUserInfoInput(false);
                  setUserName('');
                  setUserEmail('');
                  setRollNumber('');
                  setAccessCode('');
                }}
                className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Retake Quiz
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">
              Question {currentQuestion + 1} of {questions.length}
            </h1>
            <div className="flex items-center space-x-4">
              {timeLeft !== null && (
                <div
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-mono text-lg font-bold ${
                    timeLeft < 60
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse'
                      : timeLeft < 300
                      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  }`}
                >
                  <Clock size={20} />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              )}
              <div className="text-sm text-gray-500">
                {Object.keys(answers).length} / {questions.length} answered
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl mb-8"
          >
            <h2 className="text-2xl font-bold mb-6">{question.question}</h2>
            <div className="space-y-4">
              {question.options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(question._id, index)}
                  className={`w-full text-left px-6 py-4 rounded-xl border-2 transition ${
                    answers[question._id] === index
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        answers[question._id] === index
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-400'
                      }`}
                    >
                      {answers[question._id] === index && (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-lg">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={20} />
            <span>Previous</span>
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition"
            >
              <CheckCircle size={20} />
              <span>Submit Quiz</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition"
            >
              <span>Next</span>
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
