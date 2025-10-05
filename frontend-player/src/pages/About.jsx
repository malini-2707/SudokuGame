import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow">
        <h1 className="text-3xl md:text-4xl font-extrabold text-grape">About BrainBlox</h1>
        <p className="text-gray-700 text-lg mt-2">
          BrainBlox is a welcoming Sudoku playground for <span className="font-semibold">everyone</span> — kids, teens,
          and adults. Whether you’re learning the basics or chasing a new personal best, BrainBlox makes it fun to
          practice logic, focus, and patience.
        </p>
      </motion.div>

      {/* Mission */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow">
        <h2 className="text-2xl font-bold mb-2">Our Mission</h2>
        <p className="text-gray-700">
          Make brain training delightful and accessible. We blend playful visuals, smooth animations, and gentle
          guidance so anyone can enjoy Sudoku — from first-time players to puzzle pros.
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow">
        <h2 className="text-2xl font-bold mb-4">Features</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[{
            title: 'Friendly, Colorful UI', text: 'Pastel gradients, rounded shapes, and subtle motion keep things calm and inviting.'
          },{
            title: 'Learn by Doing', text: 'Built‑in tutorial video and hints help you understand strategies step by step.'
          },{
            title: 'Progress & Pride', text: 'Profiles, scores, and leaderboards celebrate your improvements over time.'
          },{
            title: 'Smooth Performance', text: 'Fast, modern frontend built with React, Tailwind, and Framer Motion.'
          }].map((f) => (
            <div key={f.title} className="p-4 rounded-xl bg-sky-50 border border-sky-100">
              <div className="text-sky-800 font-semibold">{f.title}</div>
              <p className="text-sky-900/80 text-sm mt-1">{f.text}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* How to Play */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow">
        <h2 className="text-2xl font-bold mb-4">How to Play</h2>
        <ol className="list-decimal pl-6 space-y-2 text-gray-700">
          <li>Each row, column, and 3×3 box must contain the digits 1–9 with no repeats.</li>
          <li>Use logic and elimination. Pencil in candidates and refine as you go.</li>
          <li>Try hints if you get stuck, and revisit the tutorial anytime.</li>
        </ol>
      </motion.div>

      {/* Difficulty Levels */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow">
        <h2 className="text-2xl font-bold mb-3">Difficulty Levels</h2>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800 border border-emerald-200">Beginner</span>
          <span className="px-3 py-1 rounded-full text-sm bg-sky-100 text-sky-800 border border-sky-200">Intermediate</span>
          <span className="px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-800 border border-amber-200">Advanced</span>
          <span className="px-3 py-1 rounded-full text-sm bg-rose-100 text-rose-800 border border-rose-200">Expert</span>
        </div>
      </motion.div>

      {/* Accessibility */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow">
        <h2 className="text-2xl font-bold mb-2">Accessibility</h2>
        <p className="text-gray-700">
          We aim for readability and clarity: high‑contrast text, large tap targets, keyboard navigation, and gentle
          animations. If anything feels off, we’d love your feedback so we can improve.
        </p>
      </motion.div>

      {/* Privacy */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow">
        <h2 className="text-2xl font-bold mb-2">Privacy</h2>
        <p className="text-gray-700">
          We respect your privacy. Accounts are used to save progress and enable leaderboards. We don’t sell personal
          data. For details, see our privacy note in the profile area.
        </p>
      </motion.div>

      {/* FAQ */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow">
        <h2 className="text-2xl font-bold mb-4">FAQ</h2>
        <div className="space-y-3">
          <details className="group bg-gray-50 rounded-xl p-4 border border-gray-200">
            <summary className="cursor-pointer font-semibold text-gray-800">Is BrainBlox free?</summary>
            <p className="mt-2 text-gray-700">Yes. You can play for free and sign in to save progress.</p>
          </details>
          <details className="group bg-gray-50 rounded-xl p-4 border border-gray-200">
            <summary className="cursor-pointer font-semibold text-gray-800">Do I need an account?</summary>
            <p className="mt-2 text-gray-700">You can explore without an account. Sign in to track scores and appear on leaderboards.</p>
          </details>
          <details className="group bg-gray-50 rounded-xl p-4 border border-gray-200">
            <summary className="cursor-pointer font-semibold text-gray-800">Is it suitable for adults too?</summary>
            <p className="mt-2 text-gray-700">Absolutely. BrainBlox is designed for all ages and skill levels.</p>
          </details>
        </div>
      </motion.div>

      {/* Contact */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow">
        <h2 className="text-2xl font-bold mb-2">Contact</h2>
        <p className="text-gray-700">
          Have feedback or ideas? Reach out via your profile page or the project README. We’re always improving BrainBlox!
        </p>
      </motion.div>
    </div>
  );
}

