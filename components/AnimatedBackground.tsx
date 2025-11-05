'use client';

import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 animated-gradient dark:animated-gradient-dark opacity-30" />
      
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30"
          style={{
            background: `radial-gradient(circle, ${
              ['#ee7752', '#e73c7e', '#23a6d5', '#23d5ab'][i % 4]
            } 0%, transparent 70%)`,
            width: Math.random() * 400 + 100,
            height: Math.random() * 400 + 100,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}
    </div>
  );
}
