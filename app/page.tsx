'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Timer,
  BarChart2,
  UsersRound,
  ArrowRight,
  Sparkles,
  Compass,
  BookMarked,
} from 'lucide-react';
import type { Quiz } from '@/types/quiz';

type RawQuiz = (Quiz & { _id?: string | { $oid?: string }; createdAt?: string | Date }) | Record<string, unknown>;

type QuizCard = {
  id: string;
  title: string;
  description: string;
  accessCode: string;
  timeLimit?: number;
  createdAt?: string;
};

const featureCards = [
  {
    title: 'Secure Access Control',
    description: 'Unique entry codes and admin workflows keep every assessment protected.',
    icon: ShieldCheck,
  },
  {
    title: 'Timed Challenges',
    description: 'Flexible countdown timers with auto-submit ensure fair play for every participant.',
    icon: Timer,
  },
  {
    title: 'Actionable Insights',
    description: 'Rich analytics with CSV exports and performance trends for rapid decision-making.',
    icon: BarChart2,
  },
  {
    title: 'Community Ready',
    description: 'Crafted for student clubs and teams with delightful, mobile-first experiences.',
    icon: UsersRound,
  },
];

export default function Home() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<QuizCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch('/api/quizzes', { cache: 'no-cache' });
        const data = await res.json();

        if (!Array.isArray(data)) {
          setFetchError('Unexpected response from the server.');
          setQuizzes([]);
          return;
        }

        const normalized = data
          .map((quiz: RawQuiz): QuizCard | null => {
            if (!quiz || typeof quiz !== 'object') {
              return null;
            }

            const idValue = (quiz as RawQuiz)?._id;
            const id = (() => {
              if (!idValue) {
                return '';
              }
              if (typeof idValue === 'string') {
                return idValue;
              }
              if (typeof idValue === 'object') {
                if ('$oid' in idValue && typeof (idValue as { $oid?: string }).$oid === 'string') {
                  return (idValue as { $oid: string }).$oid;
                }
                if ('toString' in idValue && typeof (idValue as { toString: () => string }).toString === 'function') {
                  const stringified = (idValue as { toString: () => string }).toString();
                  return stringified === '[object Object]' ? '' : stringified;
                }
              }
              return '';
            })();

            if (!id) {
              return null;
            }

            const title = (quiz as Quiz).title ?? 'Untitled Quiz';
            const description = (quiz as Quiz).description ?? 'Stay tuned for more details.';
            const accessCode = (quiz as Quiz).accessCode ?? '';
            const timeLimit = (quiz as Quiz).timeLimit;
            const createdAtRaw = (quiz as { createdAt?: string | Date }).createdAt;
            const createdAt = createdAtRaw ? new Date(createdAtRaw).toISOString() : undefined;

            return {
              id,
              title,
              description,
              accessCode,
              timeLimit,
              createdAt,
            };
          })
          .filter((quiz): quiz is QuizCard => Boolean(quiz?.id));

        setQuizzes(normalized);
        setFetchError(null);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setFetchError('Unable to load quizzes right now. Please try again shortly.');
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Active Quizzes', value: quizzes.length.toString() },
      {
        label: 'Timed Challenges',
        value: quizzes.filter((quiz) => (quiz.timeLimit ?? 0) > 0).length.toString(),
      },
      { label: 'Average Access Time', value: '~2 mins' },
    ],
    [quizzes]
  );

  const handleQuizClick = (quizId: string) => {
    router.push(`/quiz/${quizId}`);
  };

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Navbar />

      <main className="relative mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center"
        >
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-600 shadow-sm backdrop-blur dark:bg-gray-900/60 dark:text-blue-300">
              <Sparkles size={14} /> Cloud Computing Club
            </span>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              Elevate learning with immersive, data-driven quiz experiences.
            </h1>
            <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Launch curated assessments in seconds, monitor progress in real time, and celebrate growth with insights that empower every member of your club.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => router.push('/auth/signin')}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:shadow-purple-500/50"
              >
                Launch Admin Console
                <ArrowRight size={16} />
              </button>
              <a
                href="#quizzes"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-500/30 bg-white/70 px-6 py-3 text-sm font-semibold text-blue-600 transition hover:border-blue-500 hover:bg-blue-50 dark:bg-gray-900/60 dark:text-blue-300"
              >
                Explore Live Quizzes
                <Compass size={16} />
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
            className="hidden h-full min-w-[240px] rounded-3xl border border-white/40 bg-white/70 p-6 shadow-2xl backdrop-blur-lg dark:border-white/10 dark:bg-gray-900/70 lg:flex lg:flex-col lg:justify-center"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + index * 0.1, duration: 0.4 }}
                className={`${index !== stats.length - 1 ? 'border-b border-gray-200/60 pb-6 dark:border-gray-700' : ''} ${index !== 0 ? 'pt-6' : ''}`}
              >
                <p className="text-4xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <section id="features" className="mt-24">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl"
            >
              Built for modern teaching & collaborative learning
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mt-4 text-base text-gray-600 dark:text-gray-300"
            >
              Every interaction is crafted to feel natural across devices—so your members stay focused on what matters.
            </motion.p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {featureCards.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group h-full rounded-3xl border border-white/50 bg-white/70 p-6 shadow-xl shadow-blue-500/5 backdrop-blur-lg transition hover:-translate-y-1 hover:shadow-blue-500/20 dark:border-white/5 dark:bg-gray-900/60"
              >
                <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-blue-500/70 via-purple-500/70 to-pink-500/70 p-3 text-white shadow-lg">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="quizzes" className="mt-28">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between gap-4"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured quizzes</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Choose a challenge, enter the access code, and start your next learning sprint.
              </p>
            </div>
            <a
              href="#features"
              className="hidden text-sm font-semibold text-blue-600 transition hover:text-blue-500 dark:text-blue-400 md:inline"
            >
              Learn about the platform →
            </a>
          </motion.div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {loading && (
              <div className="md:col-span-2 xl:col-span-3">
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-full rounded-3xl border border-white/40 bg-white/60 p-6 shadow-lg backdrop-blur dark:border-white/10 dark:bg-gray-900/60"
                    >
                      <div className="h-6 w-32 rounded-full bg-gray-200 dark:bg-gray-700" />
                      <div className="mt-4 space-y-3">
                        <div className="h-4 w-full rounded-full bg-gray-200/80 dark:bg-gray-700" />
                        <div className="h-4 w-4/5 rounded-full bg-gray-200/70 dark:bg-gray-700" />
                        <div className="h-4 w-2/3 rounded-full bg-gray-200/60 dark:bg-gray-700" />
                      </div>
                      <div className="mt-8 h-11 w-full rounded-full bg-gray-200/70 dark:bg-gray-700" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && fetchError && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="md:col-span-2 xl:col-span-3 rounded-3xl border border-red-300/40 bg-red-50/70 p-6 text-sm text-red-700 backdrop-blur dark:border-red-500/30 dark:bg-red-900/30 dark:text-red-200"
              >
                {fetchError}
              </motion.div>
            )}

            {!loading && !fetchError && quizzes.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="md:col-span-2 xl:col-span-3 rounded-3xl border border-white/40 bg-white/70 p-10 text-center text-gray-600 backdrop-blur dark:border-white/10 dark:bg-gray-900/60 dark:text-gray-300"
              >
                <BookMarked className="mx-auto h-12 w-12 text-blue-500" />
                <p className="mt-4 text-base font-semibold">No quizzes are live at the moment.</p>
                <p className="mt-2 text-sm">Check back soon or create one from the admin dashboard.</p>
              </motion.div>
            )}

            {!loading && !fetchError &&
              quizzes.map((quiz, index) => (
                <motion.article
                  key={quiz.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  className="group flex h-full flex-col justify-between rounded-3xl border border-white/40 bg-white/80 p-6 shadow-xl shadow-blue-500/5 transition hover:-translate-y-1 hover:shadow-blue-500/30 backdrop-blur dark:border-white/10 dark:bg-gray-900/70"
                >
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-300">
                      Access code: {quiz.accessCode || 'Pending'}
                    </div>
                    <h3 className="mt-4 text-2xl font-semibold text-gray-900 transition group-hover:text-blue-600 dark:text-white">
                      {quiz.title}
                    </h3>
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{quiz.description}</p>
                  </div>

                  <div className="mt-6 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                    <span>
                      {quiz.timeLimit && quiz.timeLimit > 0 ? `${quiz.timeLimit} min timer` : 'No time limit'}
                    </span>
                    {quiz.createdAt && (
                      <span>Added {new Date(quiz.createdAt).toLocaleDateString()}</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleQuizClick(quiz.id)}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:shadow-purple-500/40"
                  >
                    Begin quiz
                    <ArrowRight size={16} />
                  </button>
                </motion.article>
              ))}
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mt-28 rounded-3xl border border-white/40 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-10 text-center text-white shadow-2xl shadow-blue-500/30 backdrop-blur"
        >
          <h2 className="text-3xl font-semibold">Ready to host impactful quiz sessions?</h2>
          <p className="mt-3 text-sm text-blue-100">
            Empower your community with engaging assessments, modern analytics, and a delightful experience across every screen size.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => router.push('/admin')}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/70 bg-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/30"
            >
              Open Admin Dashboard
              <ArrowRight size={16} />
            </button>
            <a
              href="mailto:ss2628681@gmail.com"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Connect with the team
            </a>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
