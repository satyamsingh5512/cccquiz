'use client';

import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Timer,
  BarChart2,
  Users,
  ArrowRight,
  Clock,
  Trophy,
  Zap,
  CheckCircle2,
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

const rotatingTexts = [
  'instant feedback',
  'detailed analytics',
  'secure access',
  'timed assessments',
  'smart insights',
];

const features = [
  {
    title: 'Timed quizzes',
    description: 'Flexible countdown timers with auto-submit. Fair for every participant.',
    icon: Timer,
  },
  {
    title: 'Question bank',
    description: 'Build comprehensive question libraries. Reuse and organize with ease.',
    icon: ShieldCheck,
  },
  {
    title: 'Reports & analytics',
    description: 'Rich insights and CSV exports. Make data-driven decisions quickly.',
    icon: BarChart2,
  },
  {
    title: 'Leaderboard',
    description: 'Gamify learning with real-time rankings. Celebrate top performers.',
    icon: Trophy,
  },
];

export default function Home() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<QuizCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Memoize static data
  const stats = useMemo(
    () => [
      { label: 'Quizzes completed', value: '10,000+' },
      { label: 'Active users', value: '2,500+' },
      { label: 'Avg. completion', value: '94%' },
    ],
    []
  );

  // Memoized quiz click handler
  const handleQuizClick = useCallback((quizId: string) => {
    router.push(`/quiz/${quizId}`);
  }, [router]);

  // Rotating text effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fetch quizzes with abort controller
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchQuizzes = async () => {
      try {
        const res = await fetch('/api/quizzes', { 
          cache: 'no-cache',
          signal: controller.signal 
        });
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
    
    return () => controller.abort();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pt-20 pb-32"
        >
          <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-12 lg:gap-16 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8 md:space-y-10">
              <div className="space-y-6 md:space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-medium tracking-wide">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  Modern quiz platform
                </div>
                
                <div className="space-y-4 md:space-y-6">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-[1.1] tracking-tight">
                    Build quizzes with
                  </h1>
                  <div className="relative overflow-hidden" style={{ height: '5.5rem', minHeight: '5.5rem' }}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentTextIndex}
                        initial={{ y: 30, opacity: 0, filter: 'blur(4px)' }}
                        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                        exit={{ y: -30, opacity: 0, filter: 'blur(4px)' }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute left-0 top-0 w-full"
                        style={{ fontSize: '0.95em' }}
                      >
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.2] tracking-tight bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#10B981] dark:from-[#60A5FA] dark:via-[#A78BFA] dark:to-[#34D399] bg-clip-text text-transparent break-words">
                          {rotatingTexts[currentTextIndex]}
                        </h1>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 sm:gap-4 pt-4 md:pt-6">
                <button
                  onClick={() => router.push('/browse')}
                  className="group h-11 sm:h-12 md:h-13 px-6 sm:px-8 rounded-xl bg-foreground text-background text-sm sm:text-base font-semibold hover:opacity-90 active:scale-[0.97] transition-all duration-200 focus-ring inline-flex items-center justify-center gap-2 shadow-lg shadow-foreground/10 w-full sm:w-auto"
                >
                  Start a quiz
                  <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => router.push('/auth/signin')}
                  className="h-11 sm:h-12 md:h-13 px-6 sm:px-8 rounded-xl border border-border/60 bg-background text-foreground text-sm sm:text-base font-semibold hover:bg-muted/50 hover:border-border active:scale-[0.97] transition-all duration-200 focus-ring w-full sm:w-auto"
                >
                  Sign in
                </button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-8 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-background flex items-center justify-center text-xs font-semibold text-white"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                  <div className="h-10 w-10 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-semibold text-muted-foreground">
                    +2k
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">2,500+</span> active users
                </div>
              </div>

              {/* Description */}
              <p className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed pt-2">
                Enterprise-grade quiz platform for institutions and teams. 
                Create, deploy, and analyze assessments at scale.
              </p>
            </div>

            {/* Right Column - Premium Glass Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-3xl blur-3xl" />
              <div className="relative rounded-2xl border border-border/60 bg-card/50 backdrop-blur-xl p-10 shadow-xl space-y-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    className={index !== stats.length - 1 ? 'pb-8 border-b border-border/50' : ''}
                  >
                    <div className="text-5xl font-semibold text-foreground tracking-tight mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Separator */}
        <div className="relative py-16">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/30" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-6 py-2 bg-background rounded-full border border-border/40 text-xs text-muted-foreground font-medium">
              Features
            </span>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-16">
          <div className="max-w-2xl mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight">
                Everything you need
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Enterprise-grade tools for creating, managing, and analyzing assessments at scale.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-8 hover:bg-card hover:border-border hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Separator */}
        <div className="relative py-16">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/30" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-6 py-2 bg-background rounded-full border border-border/40 text-xs text-muted-foreground font-medium">
              Available Quizzes
            </span>
          </div>
        </div>

        {/* Quizzes Section */}
        <section id="quizzes" className="py-16">
          <div className="max-w-2xl mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight">Available quizzes</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">Choose a quiz and get started in seconds</p>
            </motion.div>
          </div>

          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-8 space-y-4">
                  <div className="h-5 w-3/4 bg-muted/50 rounded-lg shimmer" />
                  <div className="space-y-2.5">
                    <div className="h-4 w-full bg-muted/50 rounded-lg shimmer" />
                    <div className="h-4 w-5/6 bg-muted/50 rounded-lg shimmer" />
                  </div>
                  <div className="h-11 w-full bg-muted/50 rounded-xl shimmer mt-6" />
                </div>
              ))}
            </div>
          )}

          {!loading && fetchError && (
            <div className="rounded-2xl border border-error/20 bg-error/5 p-8 text-error text-center">
              <p className="text-sm font-medium">{fetchError}</p>
            </div>
          )}

          {!loading && !fetchError && quizzes.length === 0 && (
            <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-16 text-center">
              <Trophy className="h-14 w-14 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No quizzes available</h3>
              <p className="text-muted-foreground text-sm">Check back soon or create your own quiz</p>
            </div>
          )}

          {!loading && !fetchError && quizzes.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {quizzes.map((quiz, index) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="group rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-8 hover:bg-card hover:border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col"
                >
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                        <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                        Active
                      </div>
                      {quiz.timeLimit && quiz.timeLimit > 0 && (
                        <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                          <Clock size={13} />
                          {quiz.timeLimit}m
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{quiz.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{quiz.description}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleQuizClick(quiz.id)}
                    className="group/btn mt-6 w-full h-11 px-4 rounded-xl bg-foreground text-background font-semibold hover:opacity-90 active:scale-[0.97] transition-all duration-200 focus-ring inline-flex items-center justify-center gap-2"
                  >
                    Start quiz
                    <ArrowRight size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Separator */}
        <div className="relative py-16">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/30" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-6 py-2 bg-background rounded-full border border-border/40 text-xs text-muted-foreground font-medium">
              Get Started
            </span>
          </div>
        </div>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="py-16"
        >
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
            <div className="relative grid lg:grid-cols-[1.2fr,0.8fr] gap-16 items-center border border-border/60 backdrop-blur-xl p-12 lg:p-20">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  Get started
                </div>
                <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-6 tracking-tight leading-tight">
                  Ready to transform your assessments?
                </h2>
                <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-xl">
                  Join leading institutions using our platform to create engaging, data-driven assessments at scale.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => router.push('/auth/signin')}
                    className="group h-12 px-8 rounded-xl bg-foreground text-background font-semibold hover:opacity-90 active:scale-[0.97] transition-all duration-200 focus-ring inline-flex items-center justify-center gap-2 shadow-lg shadow-foreground/10"
                  >
                    Get started
                    <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <button
                    onClick={() => router.push('/browse')}
                    className="h-12 px-8 rounded-xl border border-border/60 bg-background/50 backdrop-blur-sm text-foreground font-semibold hover:bg-muted/50 hover:border-border active:scale-[0.97] transition-all duration-200 focus-ring"
                  >
                    Browse quizzes
                  </button>
                </div>
              </div>
              <div className="hidden lg:grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <div className="rounded-2xl bg-card/50 backdrop-blur-sm border border-border/60 p-6 hover:bg-card hover:shadow-lg transition-all duration-300">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4">
                      <Timer className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-1 text-sm">Timed</h4>
                    <p className="text-xs text-muted-foreground">Auto-submit</p>
                  </div>
                  <div className="rounded-2xl bg-card/50 backdrop-blur-sm border border-border/60 p-6 hover:bg-card hover:shadow-lg transition-all duration-300">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center mb-4">
                      <Trophy className="h-5 w-5 text-accent" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-1 text-sm">Rankings</h4>
                    <p className="text-xs text-muted-foreground">Leaderboards</p>
                  </div>
                </div>
                <div className="space-y-3 pt-8">
                  <div className="rounded-2xl bg-card/50 backdrop-blur-sm border border-border/60 p-6 hover:bg-card hover:shadow-lg transition-all duration-300">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-secondary/10 to-accent/10 flex items-center justify-center mb-4">
                      <BarChart2 className="h-5 w-5 text-secondary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-1 text-sm">Analytics</h4>
                    <p className="text-xs text-muted-foreground">Track progress</p>
                  </div>
                  <div className="rounded-2xl bg-card/50 backdrop-blur-sm border border-border/60 p-6 hover:bg-card hover:shadow-lg transition-all duration-300">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-1 text-sm">Secure</h4>
                    <p className="text-xs text-muted-foreground">Access codes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-border/30 bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                  <Image
                    src="/logo.png"
                    alt="Quizo"
                    fill
                    sizes="40px"
                    loading="lazy"
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Quizo</h3>
                  <p className="text-xs text-muted-foreground">Quiz Platform</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md mb-6">
                Enterprise-grade quiz platform for institutions and teams. Create, deploy, and analyze assessments at scale.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Made with</span>
                <span className="text-red-500 animate-pulse">❤️</span>
                <span>by</span>
                <a 
                  href="https://github.com/satyamsingh5512" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold text-foreground hover:text-primary transition-colors underline decoration-dotted underline-offset-4"
                >
                  Satym
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/browse" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Browse Quizzes
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboards" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Leaderboards
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/create-quiz" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Create Quiz
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => window.alert('Privacy Policy\n\nWe respect your privacy and are committed to protecting your personal data. This platform collects minimal information necessary for functionality.\n\nData Collection:\n- Account information (email, name)\n- Quiz attempts and scores\n- Usage analytics\n\nData Usage:\n- Improve user experience\n- Track progress and performance\n- Generate leaderboards\n\nData Protection:\n- Secure encryption\n- No data sharing with third parties\n- Regular security audits\n\nContact: For privacy concerns, please reach out through GitHub.')}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => window.alert('Terms of Service\n\nBy using this platform, you agree to:\n\n1. Use the service responsibly\n2. Not share access codes publicly\n3. Respect other users\n4. Not attempt to cheat or manipulate results\n5. Provide accurate information\n\nThe platform reserves the right to:\n- Modify features and functionality\n- Suspend accounts for violations\n- Remove inappropriate content\n\nDisclaimer:\nThis service is provided "as is" without warranties. We are not liable for any damages arising from use of the platform.')}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <a 
                    href="https://github.com/satyamsingh5512" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border/30 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                © {new Date().getFullYear()} Quizo. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a 
                  href="https://github.com/satyamsingh5512" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="GitHub"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
