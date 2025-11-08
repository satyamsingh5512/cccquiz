'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Wrench, Clock, Mail } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function MaintenanceWrapper({ children }: { children: React.ReactNode }) {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        const res = await fetch('/api/maintenance');
        const data = await res.json();
        setMaintenanceMode(data.maintenanceMode);
      } catch (error) {
        console.error('Error checking maintenance mode:', error);
      } finally {
        setLoading(false);
      }
    };

    checkMaintenanceMode();
  }, []);

  // Allow access to admin routes
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/auth')) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (maintenanceMode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedBackground />
        
        <div className="relative z-10 mx-auto max-w-2xl px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 shadow-2xl"
            >
              <Wrench className="h-12 w-12 text-white" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl font-black text-gray-900 dark:text-white sm:text-6xl"
            >
              We'll Be Right Back
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg text-gray-600 dark:text-gray-300"
            >
              We're currently performing scheduled maintenance to improve your experience. 
              We'll be back online shortly.
            </motion.p>

            {/* Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-12 grid gap-6 sm:grid-cols-2"
            >
              <div className="rounded-2xl border border-white/40 bg-white/70 p-6 backdrop-blur-lg dark:border-white/10 dark:bg-gray-900/70">
                <Clock className="mx-auto h-8 w-8 text-blue-600 dark:text-blue-400" />
                <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
                  Expected Duration
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  A few hours
                </p>
              </div>

              <div className="rounded-2xl border border-white/40 bg-white/70 p-6 backdrop-blur-lg dark:border-white/10 dark:bg-gray-900/70">
                <Mail className="mx-auto h-8 w-8 text-purple-600 dark:text-purple-400" />
                <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
                  Need Help?
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  <a 
                    href="mailto:ss2628681@gmail.com"
                    className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    Contact Support
                  </a>
                </p>
              </div>
            </motion.div>

            {/* Footer Message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-8 text-sm text-gray-500 dark:text-gray-400"
            >
              Thank you for your patience. We appreciate your understanding.
            </motion.p>
          </motion.div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
