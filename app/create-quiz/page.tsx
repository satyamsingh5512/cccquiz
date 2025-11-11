'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';

export default function CreateQuizPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [timerType, setTimerType] = useState<'none' | 'whole' | 'perQuestion'>('none');
  const [wholeQuizTime, setWholeQuizTime] = useState(10);
  const [perQuestionTime, setPerQuestionTime] = useState(30);
  const [allowSkip, setAllowSkip] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      },
    ]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    setLoading(true);

    try {
      // Create quiz
      const quizRes = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          description, 
          accessCode,
          timerType,
          timeLimit: timerType === 'whole' ? wholeQuizTime : 0,
          perQuestionTime: timerType === 'perQuestion' ? perQuestionTime : 0,
          allowSkip,
        }),
      });

      if (!quizRes.ok) {
        const error = await quizRes.json();
        throw new Error(error.error || 'Failed to create quiz');
      }

      const quiz = await quizRes.json();

      // Add questions
      for (const q of questions) {
        const questionRes = await fetch('/api/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quizId: quiz._id,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
          }),
        });

        if (!questionRes.ok) {
          console.error('Failed to add question:', q.question);
        }
      }

      alert('Quiz created successfully!');
      router.push('/my-quizzes');
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert(error instanceof Error ? error.message : 'Failed to create quiz. Please try again.');
    } finally {
      setLoading(false);
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create New Quiz
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-3xl border border-white/40 bg-white/80 p-8 backdrop-blur-lg dark:border-white/10 dark:bg-gray-900/80">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Quiz Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800"
                    placeholder="e.g., JavaScript Basics"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800"
                    placeholder="Brief description of your quiz"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Access Code <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800"
                    placeholder="e.g., QUIZ2024 (leave empty for auto-generated)"
                    maxLength={10}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Students will need this code to access the quiz
                  </p>
                </div>
              </div>
            </div>

            {/* Timer Configuration */}
            <div className="rounded-3xl border border-white/40 bg-white/80 p-8 backdrop-blur-lg dark:border-white/10 dark:bg-gray-900/80">
              <h3 className="text-lg font-semibold mb-4">Timer Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-3">Timer Type</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setTimerType('none')}
                      className={`p-4 rounded-lg border-2 transition ${
                        timerType === 'none'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                      }`}
                    >
                      <div className="font-semibold">No Timer</div>
                      <div className="text-xs text-gray-500 mt-1">Unlimited time</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimerType('whole')}
                      className={`p-4 rounded-lg border-2 transition ${
                        timerType === 'whole'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                      }`}
                    >
                      <div className="font-semibold">Whole Quiz</div>
                      <div className="text-xs text-gray-500 mt-1">Total time limit</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimerType('perQuestion')}
                      className={`p-4 rounded-lg border-2 transition ${
                        timerType === 'perQuestion'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                      }`}
                    >
                      <div className="font-semibold">Per Question</div>
                      <div className="text-xs text-gray-500 mt-1">Time per question</div>
                    </button>
                  </div>
                </div>

                {timerType === 'whole' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Total Quiz Time (minutes)
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {[5, 10, 15, 20, 30, 45, 60].map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setWholeQuizTime(time)}
                          className={`px-4 py-2 rounded-lg border transition ${
                            wholeQuizTime === time
                              ? 'border-blue-500 bg-blue-500 text-white'
                              : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                          }`}
                        >
                          {time} min
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      value={wholeQuizTime}
                      onChange={(e) => setWholeQuizTime(parseInt(e.target.value) || 10)}
                      min="1"
                      max="180"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800"
                      placeholder="Custom time in minutes"
                    />
                  </div>
                )}

                {timerType === 'perQuestion' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Time Per Question (seconds)
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {[15, 30, 45, 60, 90, 120].map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setPerQuestionTime(time)}
                          className={`px-4 py-2 rounded-lg border transition ${
                            perQuestionTime === time
                              ? 'border-blue-500 bg-blue-500 text-white'
                              : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                          }`}
                        >
                          {time}s
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      value={perQuestionTime}
                      onChange={(e) => setPerQuestionTime(parseInt(e.target.value) || 30)}
                      min="5"
                      max="300"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800"
                      placeholder="Custom time in seconds"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      ⚠️ Questions will auto-advance when time expires (unanswered questions marked as skipped)
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div>
                    <div className="font-medium">Allow Question Skipping</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Students can skip questions and return later
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAllowSkip(!allowSkip)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      allowSkip ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        allowSkip ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="rounded-3xl border border-white/40 bg-white/80 p-8 backdrop-blur-lg dark:border-white/10 dark:bg-gray-900/80"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">Question {qIndex + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Question</label>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800"
                      placeholder="Enter your question"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Options</label>
                    {q.options.map((option: string, oIndex: number) => (
                      <div key={oIndex} className="flex items-center gap-2 mb-2">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={q.correctAnswer === oIndex}
                          onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                          className="w-4 h-4"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800"
                          placeholder={`Option ${oIndex + 1}`}
                          required
                        />
                      </div>
                    ))}
                    <p className="text-xs text-gray-500 mt-2">Select the correct answer</p>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addQuestion}
              className="w-full rounded-lg border-2 border-dashed border-gray-300 bg-white/50 px-4 py-4 font-semibold text-gray-600 transition hover:border-blue-500 hover:text-blue-600 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-300"
            >
              <Plus className="inline mr-2" size={20} />
              Add Question
            </button>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || questions.length === 0}
                className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 font-semibold text-white transition hover:shadow-lg disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Quiz'}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
