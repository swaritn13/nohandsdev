'use client';

import React, { useState, useEffect } from 'react';
import {
  Mic,
  Sparkles,
  GitPullRequest,
  Check,
  Copy,
  AlertCircle,
  ShieldAlert,
  Zap,
  Info,
  RotateCcw,
} from 'lucide-react';
import { MOCK_PR_SCENARIOS, MockPrScenario } from '@/data/mockScenarios';

interface PrReviewerProps {
  isJudgeDemo: boolean;
  onDictateWords: (count: number) => void;
}

export const PrReviewer: React.FC<PrReviewerProps> = ({
  isJudgeDemo,
  onDictateWords,
}) => {
  const [activeScenario] = useState<MockPrScenario>(MOCK_PR_SCENARIOS[0]);
  const [voiceNotes, setVoiceNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reviewResult, setReviewResult] = useState<MockPrScenario['generatedReview'] | null>(null);
  const [copiedReview, setCopiedReview] = useState(false);

  // Auto-populate when Judge Demo toggle is on
  useEffect(() => {
    if (isJudgeDemo && !voiceNotes) {
      setVoiceNotes(activeScenario.voiceReviewInput);
      setReviewResult(activeScenario.generatedReview);
      onDictateWords(activeScenario.voiceReviewInput.split(' ').length);
    }
  }, [isJudgeDemo]);

  const handleNotesChange = (val: string) => {
    setVoiceNotes(val);
    const words = val.trim().split(/\s+/).filter(Boolean).length;
    onDictateWords(words);
  };

  const handleRunReview = async () => {
    if (!voiceNotes.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'review',
          prompt: voiceNotes,
          context: `PR: ${activeScenario.title}`,
        }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        setReviewResult(data.result);
      }
    } catch (e) {
      console.error(e);
      setReviewResult(activeScenario.generatedReview);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatReviewMarkdown = () => {
    if (!reviewResult) return '';
    const commentsMd = reviewResult.comments
      .map(
        (c) =>
          `**[${c.type.toUpperCase()}]** \`${c.filename}:${c.line}\`\n${c.comment}`
      )
      .join('\n\n');

    const changelogMd = reviewResult.changelog.map((cl) => `- ${cl}`).join('\n');

    return (
      `## 🔍 Code Review Summary\n${reviewResult.summary}\n\n` +
      `### 💬 Inline Comments\n${commentsMd}\n\n` +
      `### 📦 Proposed Release Notes\n${changelogMd}`
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formatReviewMarkdown());
    setCopiedReview(true);
    setTimeout(() => setCopiedReview(false), 2000);
  };

  const getBadgeIcon = (type: string) => {
    switch (type) {
      case 'Bug':
        return <AlertCircle className="size-3.5 text-rose-400" />;
      case 'Security':
        return <ShieldAlert className="size-3.5 text-amber-400" />;
      case 'Performance':
        return <Zap className="size-3.5 text-cyan-400" />;
      default:
        return <Info className="size-3.5 text-zinc-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Code Diff & Voice Review Input */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        {/* Pull Request Card */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <GitPullRequest className="size-4 text-emerald-400" />
              <span className="font-semibold text-zinc-200 text-sm">
                #{activeScenario.prNumber}: {activeScenario.title}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700">
                {activeScenario.branch}
              </span>
              <span>by {activeScenario.author}</span>
            </div>
          </div>

          {/* Diff View */}
          <div className="mt-4 space-y-4">
            {activeScenario.diffSnippet.map((file, fIdx) => (
              <div key={fIdx} className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950">
                <div className="bg-zinc-900/80 px-3.5 py-1.5 border-b border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-300">
                  <span>{file.filename}</span>
                  <span className="text-[10px] uppercase text-zinc-500">{file.status}</span>
                </div>
                <div className="font-mono text-xs overflow-x-auto divide-y divide-zinc-900/40">
                  {file.lines.map((l, lIdx) => (
                    <div
                      key={lIdx}
                      className={`flex items-start px-3 py-1 ${
                        l.type === 'add'
                          ? 'bg-emerald-950/25 text-emerald-300'
                          : l.type === 'delete'
                          ? 'bg-rose-950/25 text-rose-300'
                          : 'text-zinc-400'
                      }`}
                    >
                      <span className="w-8 shrink-0 text-zinc-600 select-none text-right pr-3">
                        {l.lineNum}
                      </span>
                      <pre className="font-mono whitespace-pre-wrap">{l.content}</pre>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spoken Review Input Box */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <Mic className="size-4 text-orange-400" />
              Speak Your Code Review Notes
            </h3>
            <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-md">
              {voiceNotes.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>

          <div className="mb-3 p-2.5 rounded-xl bg-orange-950/20 border border-orange-900/40 text-[11px] text-orange-200/90 flex items-center gap-2">
            <Mic className="size-3.5 text-orange-400 shrink-0" />
            <span>
              Speak your line-by-line feedback with Wispr Flow. Mention line numbers, security flags, or suggestions.
            </span>
          </div>

          <textarea
            value={voiceNotes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Hold hotkey and speak your review: 'In auth.ts line 32, wrap JSON.parse in try-catch to prevent crashes. In rateLimit.ts, handle missing REDIS_URL gracefully...'"
            className="w-full h-32 bg-zinc-950/70 border border-zinc-800 rounded-xl p-3.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 resize-none font-sans leading-relaxed"
          />

          <div className="mt-3 flex items-center justify-between">
            <button
              onClick={() => {
                setVoiceNotes(activeScenario.voiceReviewInput);
                setReviewResult(activeScenario.generatedReview);
                onDictateWords(activeScenario.voiceReviewInput.split(' ').length);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-zinc-800/70 hover:bg-zinc-800 text-zinc-300 transition-colors border border-zinc-700/50"
            >
              ⚡ Load Sample Voice Review
            </button>

            {voiceNotes && (
              <button
                onClick={() => {
                  setVoiceNotes('');
                  setReviewResult(null);
                }}
                className="text-xs p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                title="Clear"
              >
                <RotateCcw className="size-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={handleRunReview}
            disabled={isGenerating || !voiceNotes.trim()}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm text-zinc-950 shadow-md shadow-orange-500/20 transition-all active:scale-[0.99]"
          >
            {isGenerating ? (
              <>
                <Sparkles className="size-4 animate-spin text-zinc-950" />
                <span>Analyzing Diff & Spoken Review...</span>
              </>
            ) : (
              <>
                <Sparkles className="size-4 text-zinc-950" />
                <span>Format Structured Review & Release Notes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Column: Structured Review Output & Release Notes */}
      <div className="lg:col-span-5 flex flex-col gap-5">
        {reviewResult ? (
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                Review Summary & Verdict
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 bg-orange-950/40 px-2.5 py-1 rounded-lg border border-orange-800/60 transition-colors"
              >
                {copiedReview ? (
                  <>
                    <Check className="size-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    <span>Copy for GitHub PR</span>
                  </>
                )}
              </button>
            </div>

            {/* Verdict */}
            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-sm text-zinc-200 leading-relaxed">
              {reviewResult.summary}
            </div>

            {/* Categorized Inline Comments */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Categorized Inline Comments ({reviewResult.comments.length})
              </h4>
              <div className="space-y-3">
                {reviewResult.comments.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-zinc-400">
                        {item.filename}:{item.line}
                      </span>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-900 border border-zinc-700">
                        {getBadgeIcon(item.type)}
                        <span>{item.type}</span>
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">{item.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Proposed Release Notes / Changelog */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Auto-Generated Changelog / Release Notes
              </h4>
              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                {reviewResult.changelog.map((cl, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                    <span>{cl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-zinc-900/40 border border-zinc-800/80 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[380px]">
            <div className="size-12 rounded-2xl bg-zinc-800/60 flex items-center justify-center text-zinc-400 mb-3">
              <GitPullRequest className="size-6 text-zinc-500" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-300">No Review Formatted Yet</h3>
            <p className="text-xs text-zinc-500 max-w-sm mt-1">
              Speak your feedback on the left diff using Wispr Flow, or click &quot;Load Sample Voice Review&quot; to test the auto-categorization.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
