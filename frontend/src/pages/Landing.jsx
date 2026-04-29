import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Bug, Brain, Code, Menu, ShieldCheck, Zap } from 'lucide-react'

void motion

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative bg-[#0a0a0f] text-[#f1f5f9] min-h-screen font-sans overflow-x-hidden">
      {/* Animated gradient mesh + subtle developer grid */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full bg-[#7c3aed]/20 blur-3xl"
          animate={{ x: [0, 90, 0], y: [0, 60, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-40 right-[-120px] w-[520px] h-[520px] rounded-full bg-[#06b6d4]/10 blur-3xl"
          animate={{ x: [0, -90, 0], y: [0, -50, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(124,58,237,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.10)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      {/* NAVBAR */}
      <nav className="relative z-10 flex justify-between items-center px-6 md:px-16 py-6 border-b border-[#1e1e2e]/70">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl border border-[#1e1e2e] bg-[#111118] flex items-center justify-center text-[#7c3aed] shadow-[0_0_0_1px_rgba(124,58,237,0.18)]">
            AD
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
              AI Debugger
            </span>
          </h1>
        </div>

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

        <div className="hidden md:flex gap-4">
          <Link to="/login" className="px-5 py-2 rounded-xl text-sm font-medium border border-slate-700 hover:border-indigo-500 transition">
            Login
          </Link>
        </div>
      </nav>

      {menuOpen && (
        <div className="relative z-10 md:hidden px-6 pt-4 pb-10">
          <div className="bg-[#111118]/60 backdrop-blur border border-[#1e1e2e] rounded-2xl shadow-[0_0_0_1px_rgba(124,58,237,0.08)] p-4 flex flex-col items-center gap-4">
            <a
              href="#features"
              onClick={() => setMenuOpen(false)}
              className="text-[#64748b] hover:text-[#f1f5f9] transition duration-200"
            >
              Features
            </a>
            <a
              href="#how"
              onClick={() => setMenuOpen(false)}
              className="text-[#64748b] hover:text-[#f1f5f9] transition duration-200"
            >
              How It Works
            </a>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="px-5 py-2 rounded-xl text-sm font-medium border border-[#1e1e2e] hover:border-[#7c3aed]/60 transition duration-200"
            >
              Login
            </Link>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="bg-[#7c3aed] hover:bg-[#a855f7] transition duration-200 px-5 py-2 rounded-xl text-sm font-semibold shadow-[0_0_0_1px_rgba(124,58,237,0.18)]"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative z-10 px-6 md:px-16 pt-20 pb-12 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="text-4xl md:text-6xl font-bold leading-tight"
        >
          Intelligent Debugging
          <span className="block bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
            Powered by AI
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="text-[#64748b] mt-6 max-w-2xl mx-auto text-lg leading-relaxed"
        >
          Developer-focused analysis that detects bugs, proposes fixes, improves performance, and hardens
          security — with actionable output.
        </motion.p>

        <div className="mt-10 grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-stretch max-w-6xl mx-auto">
          {/* Glass hero content */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-[#111118]/50 backdrop-blur border border-[#1e1e2e] rounded-2xl p-6 md:p-8 shadow-[0_0_0_1px_rgba(124,58,237,0.10)] text-left"
          >
            <h3 className="text-xl font-semibold tracking-tight text-[#f1f5f9]">
              Your code, analyzed with precision
            </h3>
            <p className="text-[#64748b] mt-3 leading-relaxed text-sm md:text-base">
              Run a targeted AI pass and get bugs, performance notes, security issues, and a refactored
              version of your code — presented in an editor-like workflow.
            </p>

            {/* CTA buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                to="/login"
                className="relative overflow-hidden bg-gradient-to-r from-[#7c3aed] to-[#a855f7] hover:from-[#7c3aed] hover:to-[#a855f7] transition duration-200 text-white px-6 py-3 rounded-xl font-semibold shadow-[0_0_0_1px_rgba(124,58,237,0.18)] flex items-center justify-center gap-2"
              >
                <motion.span
                  className="absolute -left-28 top-0 h-full w-28 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.50),transparent)]"
                  animate={{ x: ['-140%', '140%'] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <span className="relative inline-flex items-center gap-2">
                  Get Started <ArrowRight size={18} />
                </span>
              </Link>

              <button
                type="button"
                className="px-6 py-3 rounded-xl font-semibold border border-[#1e1e2e] bg-[#111118]/40 hover:bg-[#111118] hover:border-[#7c3aed]/40 transition duration-200"
              >
                Watch Demo
              </button>
            </div>

            {/* Stats bar */}
            <div className="mt-7 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-[#7c3aed]/30 bg-[#7c3aed]/10 px-3 py-3 text-left">
                <div className="text-[11px] tracking-tight text-[#64748b]">Languages</div>
                <div className="text-lg font-bold text-[#a855f7] mt-1">5+</div>
              </div>
              <div className="rounded-xl border border-[#06b6d4]/30 bg-[#06b6d4]/10 px-3 py-3 text-left">
                <div className="text-[11px] tracking-tight text-[#64748b]">Bugs Caught</div>
                <div className="text-lg font-bold text-[#06b6d4] mt-1">1200+</div>
              </div>
              <div className="rounded-xl border border-[#7c3aed]/30 bg-[#7c3aed]/10 px-3 py-3 text-left">
                <div className="text-[11px] tracking-tight text-[#64748b]">Developers</div>
                <div className="text-lg font-bold text-[#a855f7] mt-1">10k+</div>
              </div>
            </div>
          </motion.div>

          {/* Code preview card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-[#111118]/40 backdrop-blur border border-[#1e1e2e] rounded-2xl p-5 md:p-6 shadow-[0_0_0_1px_rgba(124,58,237,0.08)]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs text-[#64748b]">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-md border border-[#1e1e2e] bg-[#111118] text-[#7c3aed]">
                  {'</>'}
                </span>
                <span className="tracking-tight">Preview</span>
              </div>
              <div className="text-xs text-[#64748b]">
                <span className="text-[#06b6d4] font-semibold">AI</span> report
              </div>
            </div>

            <pre className="text-left text-xs md:text-sm text-[#64748b] bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl p-4 overflow-x-auto">
              <code className="whitespace-pre-wrap">
                {`// Paste code → Analyze → Get fixes
const bugs = await debugger.analyze(code, language);

bugs.forEach((b) => {
  console.log(b.issue, b.fix);
});`}
              </code>
            </pre>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-[#64748b]">
                <span className="text-[#7c3aed] font-semibold">Rule:</span> Fix null risks
              </div>
              <div className="text-xs">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#7c3aed]/30 bg-[#7c3aed]/10 text-[#a855f7]">
                  <span className="w-2 h-2 rounded-full bg-[#06b6d4]" />
                  Live
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative z-10 px-6 md:px-16 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
              Powerful AI Capabilities
            </h3>
            <p className="text-[#64748b] mt-3 max-w-2xl mx-auto leading-relaxed">
              Clean output, editor-friendly structure, and explanations you can ship with.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <Feature
              icon={<Bug className="text-[#7c3aed]" size={20} />}
              title="Real-Time Bug Detection"
              desc="Detect logical errors, runtime issues, and risky patterns instantly."
            />
            <Feature
              icon={<Brain className="text-[#06b6d4]" size={20} />}
              title="AI Fix Suggestions"
              desc="Structured fixes with clear reasoning and actionable steps."
            />
            <Feature
              icon={<Zap className="text-[#f59e0b]" size={20} />}
              title="Performance Optimization"
              desc="Analyze complexity and refactor inefficient code paths."
            />
            <Feature
              icon={<ShieldCheck className="text-[#ef4444]" size={20} />}
              title="Security Scanner"
              desc="Identify vulnerabilities and insecure coding patterns."
            />
            <Feature
              icon={<Code className="text-[#a855f7]" size={20} />}
              title="Code Refactoring"
              desc="Clean messy code and improve maintainability automatically."
            />
            <Feature
              icon={<Brain className="text-[#7c3aed]" size={20} />}
              title="Explain for Beginners"
              desc="Understand complex logic in human language, without losing rigor."
            />
          </div>
        </div>
      </section>

      <section id="how" className="relative z-10 px-6 md:px-16 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-center">
            How It Works
          </h3>

          <div className="mt-12 grid md:grid-cols-3 gap-6 md:gap-8">
            <Step number="01" title="Paste Your Code" desc="Copy snippets or upload a file directly." />
            <Step number="02" title="AI Analysis" desc="Our assistant inspects logic, performance, and security." />
            <Step number="03" title="Fix & Improve" desc="Get actionable suggestions and refactored code output." />
          </div>
        </div>
      </section>

      <section id="contact" className="relative z-10 px-6 md:px-16 pb-16 md:pb-20">
        <div className="max-w-6xl mx-auto bg-[#111118]/40 backdrop-blur border border-[#1e1e2e] rounded-3xl p-8 md:p-10 shadow-[0_0_0_1px_rgba(124,58,237,0.08)] text-center">
          <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
            Ready to Debug Smarter?
          </h3>
          <p className="text-[#64748b] mt-3 max-w-2xl mx-auto leading-relaxed">
            Move faster with an AI workflow that feels like your editor.
          </p>

          <Link
            to="/login"
            className="mt-8 inline-flex items-center justify-center relative overflow-hidden bg-gradient-to-r from-[#7c3aed] to-[#a855f7] hover:from-[#7c3aed] hover:to-[#a855f7] transition duration-200 text-white px-10 py-4 rounded-2xl text-lg font-semibold shadow-[0_0_0_1px_rgba(124,58,237,0.18)]"
          >
            <motion.span
              className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.45),transparent)]"
              initial={{ x: '-150%' }}
              animate={{ x: ['-150%', '150%'] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            Get Started Now <ArrowRight size={18} className="relative" />
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-[#1e1e2e] py-8 text-center text-sm text-[#64748b]">
        © 2026 AI Debugger
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="bg-[#111118]/40 backdrop-blur border border-[#1e1e2e] rounded-2xl p-7 hover:border-[#7c3aed]/40 shadow-[0_0_0_1px_rgba(124,58,237,0.08)] transition duration-200"
    >
      <div className="h-10 w-10 rounded-xl border border-[#1e1e2e] bg-[#0a0a0f] flex items-center justify-center">
        {icon}
      </div>
      <h4 className="text-lg font-semibold mt-4 tracking-tight">{title}</h4>
      <p className="text-[#64748b] mt-2 leading-relaxed text-sm">{desc}</p>
    </motion.div>
  );
}

function Step({ number, title, desc }) {
  return (
    <div className="bg-[#111118]/30 backdrop-blur border border-[#1e1e2e] rounded-2xl p-7 shadow-[0_0_0_1px_rgba(124,58,237,0.06)]">
      <div className="text-[#7c3aed] text-3xl font-bold tracking-tight">{number}</div>
      <h4 className="text-lg font-semibold mt-3 tracking-tight">{title}</h4>
      <p className="text-[#64748b] mt-2 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}
