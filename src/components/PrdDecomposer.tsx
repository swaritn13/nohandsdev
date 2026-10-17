'use client';

import React, { useState, useEffect } from 'react';
import {
  Mic,
  Sparkles,
  Copy,
  Check,
  FileText,
  ListTodo,
  Layers,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { MOCK_PRD_SCENARIOS, MockPrdScenario } from '@/data/mockScenarios';

interface PrdDecomposerProps {
  isJudgeDemo: boolean;
  onDictateWords: (count: number) => void;
}

export const PrdDecomposer: React.FC<PrdDecomposerProps> = ({
  isJudgeDemo,
  onDictateWords,
}) => {
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [result, setResult] = useState<MockPrdScenario['prd'] | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'prd' | 'architecture' | 'issues'>('prd');

  // If Judge Demo is enabled, prefill with scenario 1
  useEffect(() => {
    if (isJudgeDemo && !transcript) {
      const sample = MOCK_PRD_SCENARIOS[0];
      setTranscript(sample.transcript);
      setResult(sample.prd);
      onDictateWords(sample.transcript.split(' ').length);
    }
  }, [isJudgeDemo]);

  const handleTranscriptChange = (val: string) => {
    setTranscript(val);
    const words = val.trim().split(/\s+/).filter(Boolean).length;
    onDictateWords(words);
  };

  const loadScenario = (index: number) => {
    const sc = MOCK_PRD_SCENARIOS[index];
    setTranscript(sc.transcript);
    setResult(sc.prd);
    onDictateWords(sc.transcript.split(' ').length);
  };

  const handleGenerate = async () => {
    if (!transcript.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'prd', prompt: transcript }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        setResult(data.result);
      }
    } catch (e) {
      console.error(e);
      // Fallback to sample 1 if network glitch
      setResult(MOCK_PRD_SCENARIOS[0].prd);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMarkdown = (content: string, key: string) => {
    navigator.clipboard.writeText(content);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const formatIssuesAsMarkdown = () => {
    if (!result?.issues) return '';
    return result.issues
      .map(
        (issue, i) =>
          `### Issue #${i + 1}: ${issue.title} [${issue.label}]\n` +
          issue.tasks.map((t) => `- [ ] ${t}`).join('\n')
      )
      .join('\n\n');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Input Column */}
      <div className="lg:col-span-5 flex flex-col gap-5">
        {/* Voice Input Card */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Mic className="size-4 text-orange-400" />
                Spoken Feature Specification
              </h2>
            </div>
            <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-md">
              {transcript.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>

          {/* Quick Shortcuts Helper */}
          <div className="mb-3 p-2.5 rounded-xl bg-orange-950/20 border border-orange-900/40 text-[11px] text-orange-200/90 flex items-center gap-2">
            <Mic className="size-3.5 text-orange-400 shrink-0" />
            <span>
              Hold <kbd className="px-1.5 py-0.5 rounded bg-orange-900/60 font-mono text-orange-300">Ctrl + Win</kbd> (Win) or <kbd className="px-1.5 py-0.5 rounded bg-orange-900/60 font-mono text-orange-300">Fn</kbd> (Mac) with Wispr Flow to talk.
            </span>
          </div>

          {/* Text Area */}
          <textarea
            value={transcript}
            onChange={(e) => handleTranscriptChange(e.target.value)}
            placeholder="Hold hotkey and describe the feature, user persona, edge cases, and requirements out loud as you would to a senior engineer..."
            className="w-full h-48 bg-zinc-950/70 border border-zinc-800 rounded-xl p-3.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 resize-none transition-all font-sans leading-relaxed"
          />

          {/* Realistic One-Click Samples */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-zinc-500 font-medium">Try Sample:</span>
            <button
              onClick={() => loadScenario(0)}
              className="text-xs px-2.5 py-1 rounded-lg bg-zinc-800/70 hover:bg-zinc-800 text-zinc-300 transition-colors border border-zinc-700/50"
            >
              💳 Stripe Team Billing
            </button>
            <button
              onClick={() => loadScenario(1)}
              className="text-xs px-2.5 py-1 rounded-lg bg-zinc-800/70 hover:bg-zinc-800 text-zinc-300 transition-colors border border-zinc-700/50"
            >
              🔍 Semantic Code Search
            </button>
            {transcript && (
              <button
                onClick={() => {
                  setTranscript('');
                  setResult(null);
                }}
                className="text-xs p-1 text-zinc-500 hover:text-zinc-300 ml-auto transition-colors"
                title="Clear"
              >
                <RotateCcw className="size-3.5" />
              </button>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading || !transcript.trim()}
            className="mt-5 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm text-zinc-950 shadow-md shadow-orange-500/20 transition-all active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <Sparkles className="size-4 animate-spin text-zinc-950" />
                <span>Structuring PRD & Tickets...</span>
              </>
            ) : (
              <>
                <Sparkles className="size-4 text-zinc-950" />
                <span>Decompose into PRD & GitHub Issues</span>
                <ArrowRight className="size-4 text-zinc-950 ml-1" />
              </>
            )}
          </button>
        </div>

        {/* Feature Highlights for Hackathon */}
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4 text-xs text-zinc-400 space-y-2">
          <p className="font-semibold text-zinc-200">Why Voice-First Spec Writing Wins:</p>
          <p>• Speeds up ideation: speak 150 words/min vs typing 40 words/min.</p>
          <p>• Eliminates blank-page syndrome for solo developers and product leads.</p>
          <p>• Instant export directly into GitHub Issues, Linear, or Jira.</p>
        </div>
      </div>

      {/* Right Output Column */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        {result ? (
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col h-full">
            {/* Header & Sub-Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-3">
              <div>
                <span className="text-xs font-mono text-orange-400 font-semibold tracking-wider uppercase">
                  Structured Output
                </span>
                <h3 className="text-lg font-bold text-zinc-100 mt-0.5">{result.title}</h3>
              </div>

              {/* Sub Tab Switcher */}
              <div className="flex items-center gap-1 bg-zinc-950/80 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto">
                <button
                  onClick={() => setActiveSubTab('prd')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeSubTab === 'prd'
                      ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <FileText className="size-3.5" />
                  <span>PRD</span>
                </button>
                <button
                  onClick={() => setActiveSubTab('architecture')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeSubTab === 'architecture'
                      ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Layers className="size-3.5" />
                  <span>Architecture</span>
                </button>
                <button
                  onClick={() => setActiveSubTab('issues')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeSubTab === 'issues'
                      ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <ListTodo className="size-3.5" />
                  <span>Issues ({result.issues?.length || 0})</span>
                </button>
              </div>
            </div>

            {/* SubTab 1: PRD Overview */}
            {activeSubTab === 'prd' && (
              <div className="py-4 space-y-5 flex-1">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Executive Summary
                  </h4>
                  <p className="text-sm text-zinc-200 leading-relaxed bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/80">
                    {result.overview}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Target Persona
                  </h4>
                  <p className="text-sm text-zinc-300">{result.persona}</p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Core Functional Requirements
                  </h4>
                  <ul className="space-y-2">
                    {result.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-zinc-300">
                        <span className="size-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {result.outOfScope?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">
                      Out of Scope (v1)
                    </h4>
                    <ul className="space-y-1.5">
                      {result.outOfScope.map((oos, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-zinc-500">
                          <span className="size-1 rounded-full bg-zinc-600 mt-1.5 shrink-0" />
                          <span>{oos}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* SubTab 2: Architecture */}
            {activeSubTab === 'architecture' && (
              <div className="py-4 space-y-5 flex-1">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Proposed API Endpoints
                  </h4>
                  <div className="space-y-2">
                    {result.technicalSpec.endpoints.map((ep, idx) => (
                      <div
                        key={idx}
                        className="font-mono text-xs p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-emerald-400"
                      >
                        {ep}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Schema & State Changes
                  </h4>
                  <div className="space-y-2">
                    {result.technicalSpec.dbChanges.map((dbc, idx) => (
                      <div
                        key={idx}
                        className="font-mono text-xs p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-amber-300"
                      >
                        {dbc}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SubTab 3: Decomposed GitHub Issues */}
            {activeSubTab === 'issues' && (
              <div className="py-4 space-y-4 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-zinc-400">
                    Ready to copy into GitHub Issues or Linear boards:
                  </p>
                  <button
                    onClick={() => handleCopyMarkdown(formatIssuesAsMarkdown(), 'issues')}
                    className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 bg-orange-950/40 px-2.5 py-1 rounded-lg border border-orange-800/60 transition-colors"
                  >
                    {copiedSection === 'issues' ? (
                      <>
                        <Check className="size-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied Markdown</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        <span>Copy All Issues</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-3">
                  {result.issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3.5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-zinc-200">
                          #{idx + 1}: {issue.title}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {issue.label}
                        </span>
                      </div>
                      <div className="space-y-1.5 pl-2">
                        {issue.tasks.map((task, tIdx) => (
                          <div key={tIdx} className="flex items-center gap-2 text-xs text-zinc-400">
                            <span className="size-3 rounded border border-zinc-700 bg-zinc-900 inline-block" />
                            <span>{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-zinc-900/40 border border-zinc-800/80 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[380px]">
            <div className="size-12 rounded-2xl bg-zinc-800/60 flex items-center justify-center text-zinc-400 mb-3">
              <FileText className="size-6 text-zinc-500" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-300">No Specification Generated Yet</h3>
            <p className="text-xs text-zinc-500 max-w-sm mt-1">
              Speak your feature idea into the left box using Wispr Flow, or click one of the sample scenarios to see the instant decomposition.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
