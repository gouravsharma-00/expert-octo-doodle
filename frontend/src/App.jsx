import { motion } from "framer-motion";
import {
  Bug,
  ShieldCheck,
  Zap,
  Code,
  Brain,
  ArrowRight,
  Menu,
} from "lucide-react";
import { useState } from "react";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-[#0b1120] text-white min-h-screen font-sans overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-6 md:px-16 py-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          AI Debugger
        </h1>

        <div className="hidden md:flex gap-8 text-slate-300">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#how" className="hover:text-white transition">How It Works</a>
          <a href="#contact" className="hover:text-white transition">Contact</a>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu />
        </button>

        <button className="hidden md:block bg-indigo-600 hover:bg-indigo-500 transition px-5 py-2 rounded-xl text-sm font-medium shadow-lg shadow-indigo-600/20">
          Install Now
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden flex flex-col items-center gap-4 py-4 bg-[#111827]">
          <a href="#features">Features</a>
          <a href="#how">How It Works</a>
          <a href="#contact">Contact</a>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="px-6 md:px-16 py-24 text-center relative">
        <div className="absolute w-96 h-96 bg-indigo-600/20 blur-3xl rounded-full top-10 left-1/2 -translate-x-1/2"></div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold leading-tight relative z-10"
        >
          Intelligent Debugging  
          <span className="block bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Powered by AI
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-400 mt-6 max-w-2xl mx-auto text-lg"
        >
          AI-driven VS Code extension that detects bugs, suggests fixes,
          improves performance, and secures your code — instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
        >
          <button className="bg-indigo-600 hover:bg-indigo-500 transition px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30">
            Install Extension <ArrowRight size={18} />
          </button>

          <button className="border border-slate-700 hover:border-indigo-500 transition px-8 py-4 rounded-2xl font-semibold">
            Watch Demo
          </button>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-6 md:px-16 py-24 bg-[#0f172a]">
        <h3 className="text-3xl font-bold text-center mb-16">
          Powerful AI Capabilities
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <Feature icon={<Bug />} title="Real-Time Bug Detection"
            desc="Detect logical errors, runtime issues, and bad practices instantly." />

          <Feature icon={<Brain />} title="AI Fix Suggestions"
            desc="Receive structured fixes with detailed explanations." />

          <Feature icon={<Zap />} title="Performance Optimization"
            desc="Analyze complexity and refactor inefficient code." />

          <Feature icon={<ShieldCheck />} title="Security Scanner"
            desc="Identify vulnerabilities and insecure coding patterns." />

          <Feature icon={<Code />} title="Code Refactoring"
            desc="Clean messy code and improve structure automatically." />

          <Feature icon={<Brain />} title="Explain for Beginners"
            desc="Understand complex logic in simple human language." />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="px-6 md:px-16 py-24">
        <h3 className="text-3xl font-bold text-center mb-16">
          How It Works
        </h3>

        <div className="grid md:grid-cols-3 gap-10 text-center">
          <Step number="01" title="Write Code"
            desc="Develop inside VS Code normally." />

          <Step number="02" title="AI Analysis"
            desc="Extension sends your code to intelligent AI agent." />

          <Step number="03" title="Fix & Improve"
            desc="Receive actionable suggestions instantly." />
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-16 py-24 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-center">
        <h3 className="text-3xl md:text-4xl font-bold">
          Ready to Debug Smarter?
        </h3>
        <p className="text-slate-400 mt-4">
          Upgrade your development workflow with AI intelligence.
        </p>

        <button className="mt-8 bg-indigo-600 hover:bg-indigo-500 transition px-10 py-4 rounded-2xl text-lg font-semibold shadow-xl shadow-indigo-600/30">
          Get Started Now
        </button>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        © 2026 AI Debugger — Built by Adesh Kumar
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-[#1e293b] p-8 rounded-2xl shadow-lg border border-slate-800 hover:border-indigo-500 transition"
    >
      <div className="text-indigo-400 mb-4">{icon}</div>
      <h4 className="text-xl font-semibold mb-3">{title}</h4>
      <p className="text-slate-400">{desc}</p>
    </motion.div>
  );
}

function Step({ number, title, desc }) {
  return (
    <div className="bg-[#1e293b] p-8 rounded-2xl shadow-lg border border-slate-800">
      <div className="text-indigo-400 text-3xl font-bold mb-4">{number}</div>
      <h4 className="text-xl font-semibold mb-3">{title}</h4>
      <p className="text-slate-400">{desc}</p>
    </div>
  );
}

export default App;