export interface MockPrdScenario {
  id: string;
  title: string;
  category: string;
  transcript: string;
  prd: {
    title: string;
    overview: string;
    persona: string;
    features: string[];
    outOfScope: string[];
    technicalSpec: {
      endpoints: string[];
      dbChanges: string[];
    };
    issues: {
      title: string;
      label: string;
      tasks: string[];
    }[];
  };
}

export interface MockPrScenario {
  id: string;
  title: string;
  prNumber: number;
  author: string;
  branch: string;
  filesChanged: number;
  diffSnippet: {
    filename: string;
    status: 'modified' | 'added';
    lines: {
      type: 'add' | 'delete' | 'context';
      content: string;
      lineNum: number;
    }[];
  }[];
  voiceReviewInput: string;
  generatedReview: {
    summary: string;
    comments: {
      line: number;
      filename: string;
      type: 'Bug' | 'Security' | 'Performance' | 'Nit';
      comment: string;
    }[];
    changelog: string[];
  };
}

export const MOCK_PRD_SCENARIOS: MockPrdScenario[] = [
  {
    id: 'billing-team',
    title: 'Multi-Tenant Team Billing & Seats',
    category: 'SaaS / Payments',
    transcript:
      'We need to implement team billing where workspace owners can invite up to 10 team members and set seat limits. It should integrate with Stripe Checkout using recurring monthly subscriptions. If a team downgrades, restrict member access to read-only rather than kicking them out. Also make sure only workspace admins can view the billing settings tab, and send a webhook notification to Slack when an invoice fails.',
    prd: {
      title: 'Workspace Team Billing & Seat-Based Subscriptions',
      overview:
        'Enable workspace owners to invite team members with tiered seat quotas, managed via Stripe recurring checkout. Gracefully handles downgrades with read-only modes and admin-only access control.',
      persona: 'B2B Workspace Admins, Startup Founders, and Finance Leads.',
      features: [
        'Stripe Checkout recurring monthly subscription flow with dynamic seat count multiplier',
        'Role-Based Access Control (RBAC): restrict billing settings tab strictly to admin roles',
        'Soft-downgrade handler: downgrade over-quota members to read-only state rather than hard deletion',
        'Automated webhook listening for `invoice.payment_failed` with Slack alert integration',
      ],
      outOfScope: [
        'Annual multi-currency wire transfers (v1 is monthly Stripe card checkout only)',
        'Granular per-folder permission matrices',
      ],
      technicalSpec: {
        endpoints: [
          'POST /api/billing/create-checkout-session',
          'POST /api/webhooks/stripe',
          'GET /api/workspace/seats/usage',
          'PATCH /api/workspace/members/:id/role',
        ],
        dbChanges: [
          'Add `seat_limit` INT and `stripe_subscription_id` VARCHAR to `workspaces` table',
          'Add `status` ENUM (active, read_only, suspended) to `workspace_members`',
        ],
      },
      issues: [
        {
          title: 'Implement Stripe Checkout & Dynamic Seat Counter',
          label: 'Backend',
          tasks: [
            'Create Stripe customer and link with workspace ID',
            'Generate checkout session with per-seat unit pricing',
            'Handle `checkout.session.completed` webhook',
          ],
        },
        {
          title: 'Add Billing Navigation & RBAC Guard',
          label: 'Frontend',
          tasks: [
            'Restrict `/settings/billing` route to workspace `OWNER` / `ADMIN` roles',
            'Build seat progress bar showing used vs allocated seats',
            'Display billing invoices table with PDF download links',
          ],
        },
        {
          title: 'Graceful Over-Quota & Downgrade State Management',
          label: 'Core Logic',
          tasks: [
            'Intercept mutations for members in `read_only` workspace state',
            'Banner prompt informing users their workspace has exceeded seat quota',
            'Slack webhook dispatcher for failed payment events',
          ],
        },
      ],
    },
  },
  {
    id: 'ai-search',
    title: 'Hybrid Semantic Code Search for Monorepos',
    category: 'Developer Tools',
    transcript:
      'Developers in our monorepo cannot find internal utilities and components easily. We need a semantic code search bar with `Ctrl + K`. It should index symbols, docstrings, and function signatures using vector embeddings in Pinecone or ChromaDB, plus fallback keyword matching. When a user queries in natural language like "where is token refreshed?", it should highlight the exact file and lines with a copy-path button.',
    prd: {
      title: 'Fast Semantic Code Search & Symbol Indexer',
      overview:
        'A global command palette (`Ctrl + K`) combining AST symbol parsing with vector embeddings to allow engineers to search codebases in natural conversational English.',
      persona: 'Software Engineers onboarding or navigating large legacy codebases.',
      features: [
        'Global search modal with instant shortcut (`Ctrl/Cmd + K`)',
        'Hybrid ranking algorithm (BM25 keyword search + text-embedding-3 vector similarity)',
        'Syntax-highlighted result previews with 1-click GitHub / IDE deeplinks',
        'Incremental git-hook indexer running on pull/merge events',
      ],
      outOfScope: [
        'Full cloud git hosting integration (local repository and monorepo indexing only for v1)',
        'Automatic code generation inside the search dialog',
      ],
      technicalSpec: {
        endpoints: [
          'POST /api/search/query',
          'POST /api/indexer/reindex-branch',
          'GET /api/indexer/status',
        ],
        dbChanges: [
          'Collection `code_embeddings` with metadata: { filePath, startLine, endLine, symbolType }',
          'Local SQLite FTS5 table for rapid keyword lookup',
        ],
      },
      issues: [
        {
          title: 'Global Command Palette UI & Keyboard Listeners',
          label: 'Frontend',
          tasks: [
            'Implement modal with Cmd+K and Esc bindings',
            'Debounced search input with loading skeleton states',
            'Keyboard arrow navigation (Up/Down/Enter) through search hits',
          ],
        },
        {
          title: 'Tree-Sitter AST Code Chunker & Embedding Pipeline',
          label: 'AI / Pipeline',
          tasks: [
            'Extract top-level functions and class declarations',
            'Batch generate OpenAI embeddings for docstrings + signatures',
            'Upsert vectors into local vector database',
          ],
        },
      ],
    },
  },
];

export const MOCK_PR_SCENARIOS: MockPrScenario[] = [
  {
    id: 'pr-auth-fix',
    title: 'Fix session race condition & add rate limit middleware',
    prNumber: 142,
    author: 'alex-dev',
    branch: 'fix/auth-session-race',
    filesChanged: 2,
    diffSnippet: [
      {
        filename: 'src/middleware/auth.ts',
        status: 'modified',
        lines: [
          { type: 'context', lineNum: 28, content: 'export async function verifySession(req: Request) {' },
          { type: 'delete', lineNum: 29, content: '-  const token = req.headers.get("authorization");' },
          { type: 'delete', lineNum: 30, content: '-  const user = await db.getUserByToken(token);' },
          { type: 'add', lineNum: 29, content: '+  const authHeader = req.headers.get("authorization")?.split(" ")[1];' },
          { type: 'add', lineNum: 30, content: '+  if (!authHeader) return new Response("Unauthorized", { status: 401 });' },
          { type: 'add', lineNum: 31, content: '+  const cached = await redis.get(`session:${authHeader}`);' },
          { type: 'add', lineNum: 32, content: '+  const user = cached ? JSON.parse(cached) : await db.getUserByToken(authHeader);' },
          { type: 'context', lineNum: 33, content: '   return user;' },
        ],
      },
      {
        filename: 'src/lib/rateLimit.ts',
        status: 'added',
        lines: [
          { type: 'add', lineNum: 1, content: '+import { Redis } from "ioredis";' },
          { type: 'add', lineNum: 2, content: '+const limiter = new Redis(process.env.REDIS_URL!);' },
          { type: 'add', lineNum: 3, content: '+export async function rateLimit(ip: string, limit = 60) {' },
          { type: 'add', lineNum: 4, content: '+  const current = await limiter.incr(ip);' },
          { type: 'add', lineNum: 5, content: '+  if (current === 1) await limiter.expire(ip, 60);' },
          { type: 'add', lineNum: 6, content: '+  return current <= limit;' },
          { type: 'add', lineNum: 7, content: '+}' },
        ],
      },
    ],
    voiceReviewInput:
      'In auth.ts line 32, if JSON.parse fails from corrupted Redis data it will crash the process, wrap it in a safe try-catch. Also in rateLimit.ts, if REDIS_URL is missing in local development it throws an unhandled crash. Let us add a fallback or graceful warning. Otherwise caching logic looks solid!',
    generatedReview: {
      summary:
        'Great performance improvement by adding Redis session caching and sliding window rate limiting. Found 1 potential crash risk in JSON parsing and missing environment variable fallback.',
      comments: [
        {
          filename: 'src/middleware/auth.ts',
          line: 32,
          type: 'Bug',
          comment:
            'Wrap `JSON.parse(cached)` in a `try/catch` or fallback to DB. If redis contains a corrupted or expired payload, an unhandled SyntaxError will crash the request handler.',
        },
        {
          filename: 'src/lib/rateLimit.ts',
          line: 2,
          type: 'Security',
          comment:
            'Avoid force unwrap `process.env.REDIS_URL!`. Provide an in-memory Map fallback or throw a descriptive startup configuration error if Redis is unreachable in test environments.',
        },
      ],
      changelog: [
        '⚡ Added Redis session caching layer to slash database auth queries by ~80%',
        '🛡 Implemented IP-based sliding window rate limiter (default 60 req/min)',
        '🔒 Hardened Bearer token parsing against malformed authorization headers',
      ],
    },
  },
];
