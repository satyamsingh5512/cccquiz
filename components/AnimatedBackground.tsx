'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

export default function AnimatedBackground() {
  // Memoize the blob configurations to prevent recalculation
  const blobs = useMemo(() => 
    [...Array(12)].map((_, i) => ({
      id: i,
      color: ['#ee7752', '#e73c7e', '#23a6d5', '#23d5ab'][i % 4],
      width: Math.random() * 300 + 150,
      height: Math.random() * 300 + 150,
      left: Math.random() * 100,
      top: Math.random() * 100,
      x: Math.random() * 60 - 30,
      y: Math.random() * 60 - 30,
      duration: Math.random() * 15 + 15,
    })), []
  );

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Static gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20" />
      
      {/* Animated blobs - reduced count for better performance */}
      {blobs.map((blob) => (
        <motion.div
          key={blob.id}
          className="absolute rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl opacity-20 will-change-transform"
          style={{
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            width: blob.width,
            height: blob.height,
            left: `${blob.left}%`,
            top: `${blob.top}%`,
          }}
          animate={{
            x: [0, blob.x, 0],
            y: [0, blob.y, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
