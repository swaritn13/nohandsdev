'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { PrdDecomposer } from '@/components/PrdDecomposer';
import { PrReviewer } from '@/components/PrReviewer';
import {
  FileText,
  GitPullRequest,
  BarChart2,
  Sparkles,
  Mic,
  Zap,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'prd' | 'review' | 'insights'>('prd');
  const [isJudgeDemo, setIsJudgeDemo] = useState(false);
  const [totalWords, setTotalWords] = useState(0);

  const handleDictateWords = (words: number) => {
    setTotalWords((prev) => Math.max(prev, words));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* Top Header */}
      <Header
        totalWords={totalWords}
        isJudgeDemo={isJudgeDemo}
        setIsJudgeDemo={setIsJudgeDemo}
      />

      {/* Judge Mode Announcement Banner if active */}
      {isJudgeDemo && (
        <div className="bg-gradient-to-r from-orange-950/80 via-zinc-900 to-amber-950/80 border-b border-orange-800/50 py-2.5 px-4 text-center">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs text-orange-200">
            <Sparkles className="size-4 text-orange-400 shrink-0" />
            <span className="font-semibold">Judges 1-Click Evaluation Mode:</span>
            <span>
              Preloaded with realistic engineering scenarios. You can test generation and copy markdown without needing external API keys.
            </span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero & Intro */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-orange-400 mb-2">
              <span className="size-2 rounded-full bg-orange-400" />
              <span>Voice-First Engineering</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-100">
              Build & Ship by Voice.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                Never Type a Spec or Review Again.
              </span>
            </h1>
            <p className="mt-2 text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Use Wispr Flow to speak thoughts at natural conversation speeds. DevVoice structures them into comprehensive PRDs, atomic GitHub issues, and contextual code review comments.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-3 bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800 shrink-0">
            <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
              <Zap className="size-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-200">4× Typing Speed</div>
              <div className="text-[11px] text-zinc-400">150 wpm voice vs 40 wpm typing</div>
            </div>
          </div>
        </div>

        {/* Primary Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-px overflow-x-auto">
          <button
            onClick={() => setActiveTab('prd')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-medium transition-all border-b-2 ${
              activeTab === 'prd'
                ? 'border-orange-500 text-orange-400 bg-zinc-900/50'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/20'
            }`}
          >
            <FileText className="size-4" />
            <span>Voice-to-PRD & Issues</span>
          </button>

          <button
            onClick={() => setActiveTab('review')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-medium transition-all border-b-2 ${
              activeTab === 'review'
                ? 'border-orange-500 text-orange-400 bg-zinc-900/50'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/20'
            }`}
          >
            <GitPullRequest className="size-4" />
            <span>Voice PR Review & Changelog</span>
          </button>

          <button
            onClick={() => setActiveTab('insights')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-medium transition-all border-b-2 ${
              activeTab === 'insights'
                ? 'border-orange-500 text-orange-400 bg-zinc-900/50'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/20'
            }`}
          >
            <BarChart2 className="size-4" />
            <span>Wispr Insights & Hackathon Proof</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'prd' && (
          <PrdDecomposer isJudgeDemo={isJudgeDemo} onDictateWords={handleDictateWords} />
        )}

        {activeTab === 'review' && (
          <PrReviewer isJudgeDemo={isJudgeDemo} onDictateWords={handleDictateWords} />
        )}

        {activeTab === 'insights' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Mic className="size-5" />
              </div>
              <h3 className="font-semibold text-zinc-200 text-base">Wispr Flow Integration</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Every prompt, specification, and code review comment in this application was generated by speaking directly into Wispr Flow using system-wide hotkeys.
              </p>
              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Active Session Words:</span>
                <span className="font-bold text-emerald-400">{totalWords}</span>
              </div>
            </div>

            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                <CheckCircle2 className="size-5" />
              </div>
              <h3 className="font-semibold text-zinc-200 text-base">WeMakeDevs Builders Track</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Submitted under Track 1: Builders for developers. Solves developer burnout by cutting out repetitive typing during architectural planning and PR code reviews.
              </p>
              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Deadline:</span>
                <span className="text-orange-400">30 Oct 2026</span>
              </div>
            </div>

            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="size-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Zap className="size-5" />
              </div>
              <h3 className="font-semibold text-zinc-200 text-base">Zero Friction Deployment</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Built with Next.js 16 and Tailwind CSS. Configured with instant fallback heuristic parsing to ensure 100% uptime for judges without requiring paid API tokens.
              </p>
              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Hosting:</span>
                <span className="text-cyan-400">Vercel Ready</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 mt-12 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 DevVoice. Built for No Hands: The Wispr Challenge by WeMakeDevs & Wispr Flow.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.wemakedevs.org/wispr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-300 transition-colors flex items-center gap-1"
            >
              <span>Hackathon Details</span>
              <ExternalLink className="size-3" />
            </a>
            <a
              href="https://wisprflow.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-300 transition-colors flex items-center gap-1"
            >
              <span>Get Wispr Flow</span>
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
