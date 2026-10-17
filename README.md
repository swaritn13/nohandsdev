# 🎙️ DevVoice — Voice-First Developer & Product Lifecycle Tool

> **Built for "No Hands: The Wispr Challenge"**  
> A 2-week voice-first hackathon by **WeMakeDevs** and **Wispr Flow**.  
> **Track:** Track 1: Builders (for Developers)

---

## ⚡ The Problem: The "Writing Bottleneck" in Software Engineering
Software engineers and technical product leads spend up to **40% of their workday typing prose instead of building**:
1. Translating feature thoughts or call notes into comprehensive **PRDs and decomposed GitHub/Linear issues**.
2. Typing line-by-line **code review comments** and synthesizing user-facing **changelogs/release notes**.

Typing is slow (~40 wpm) and leads to rushed, terse reviews and backlog clutter.

---

## 💡 The Solution: DevVoice
**DevVoice** turns natural spoken speech into production-ready engineering documentation at conversational speeds (~150 wpm) using **Wispr Flow**:

1. **Tab 1: Voice $\rightarrow$ PRD & Issue Decomposer**
   - Speak a stream of thoughts or post-meeting debrief.
   - Automatically decomposes thoughts into:
     - Executive Summary & Problem Scope
     - Technical Spec (REST Endpoints & Database Schemas)
     - Atomic GitHub/Linear Issues with checklist tasks.
   - 1-click **"Copy Markdown"** for instant board creation.

2. **Tab 2: Voice $\rightarrow$ PR Code Reviewer & Changelog**
   - Inspect GitHub pull request diffs.
   - Dictate conversational feedback on any line or file.
   - Auto-categorizes comments as `[Bug]`, `[Security]`, `[Performance]`, or `[Nit]`.
   - Generates user-facing changelog and release notes.

3. **1-Click Judge Evaluation Mode**
   - Built specifically for hackathon judges to test preloaded realistic scenarios (Stripe Team Billing, Redis Session Cache) with zero setup or API keys required.

---

## 🛠️ Tech Stack
- **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Voice Engine:** [Wispr Flow](https://wisprflow.ai/) (system-wide voice dictation via `Ctrl + Win` / `Fn`)
- **API Processing:** Next.js Route Handlers with Gemini / OpenAI support + instant heuristic fallback parser for 100% uptime.

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/<your-username>/devvoice.git
cd devvoice
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Optional Environment Variables (for dynamic AI generation)
Create a `.env.local` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
# or
OPENAI_API_KEY=your_openai_api_key_here
```
*(Note: If no API key is provided, DevVoice automatically uses its smart heuristic parsing engine so you can demo without API costs).*

---

## 🏆 Hackathon Rubric Alignment
- **30% Real Problem:** Tackles the biggest developer time-sink (writing specs & reviews).
- **30% Wispr Meaningfulness:** Voice is the central interaction model, both during the build and in the tool's core workflow.
- **25% It Works:** Fully interactive, responsive, and deployable to Vercel in 1 click.
- **15% Clear Demo:** Clean, intuitive UI designed for under 2-minute video walkthroughs.
