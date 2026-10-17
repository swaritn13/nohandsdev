'use client';

import React from 'react';
import { Mic, Sparkles, Volume2, ExternalLink } from 'lucide-react';

interface HeaderProps {
  totalWords: number;
  isJudgeDemo: boolean;
  setIsJudgeDemo: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalWords,
  isJudgeDemo,
  setIsJudgeDemo,
}) => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Badges */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-gradient-to-tr from-coral-500 to-amber-500 shadow-md shadow-coral-500/20 text-white font-bold text-xl">
              <Mic className="size-5 text-zinc-950 fill-zinc-950 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-zinc-100">
                  Dev<span className="text-orange-400">Voice</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-950/60 text-orange-300 border border-orange-800/60 uppercase tracking-wider">
                  Wispr Flow
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Speak your PRDs, tasks, and code reviews at 4× typing speed
              </p>
            </div>
          </div>

          {/* Wispr Counter & Judge Quick Toggle */}
          <div className="flex items-center gap-4">
            {/* Live Wispr Transcribed Counter */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-mono">
              <Volume2 className="size-3.5 text-emerald-400 animate-pulse" />
              <span>Transcribed:</span>
              <span className="font-bold text-emerald-400">{totalWords}</span>
              <span className="text-zinc-500">words</span>
            </div>

            {/* Judge Mode Switch */}
            <button
              onClick={() => setIsJudgeDemo(!isJudgeDemo)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                isJudgeDemo
                  ? 'bg-orange-500/10 text-orange-300 border-orange-500/40 shadow-sm shadow-orange-500/20'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
            >
              <Sparkles className="size-3.5 text-orange-400" />
              <span>Judge 1-Click Demo</span>
              <span
                className={`size-2 rounded-full ${
                  isJudgeDemo ? 'bg-orange-400 ring-2 ring-orange-400/30' : 'bg-zinc-600'
                }`}
              />
            </button>

            {/* External Links */}
            <a
              href="https://www.wemakedevs.org/wispr"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <span>Hackathon</span>
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
