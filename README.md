# Orbit CRM

Frontend-only CRM built with Next.js App Router, TypeScript, Tailwind CSS 4 and Lucide icons.

## Run locally

```sh
npm install
npm run dev
```

Create `.env.local` from `.env.example` and choose a unique admin email, a long password, and a random session secret (at least 32 characters). Generate a secret with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Do not commit `.env.local`. Open http://localhost:3000.

## Routes

- `/`: responsive login form
- `/login/`: validated demo sign-in
- `/dashboard/`: overview and charts
- `/customers/`: searchable, sortable customer table
- `/customers/[id]/`: statically generated customer details
- `/deals/`: draggable sales pipeline
- `/tasks/`: task list and filters
- `/settings/`: profile and preferences
- `/reports/`: additional charts
- `/calendar/`: task and deal calendar

The dedicated admin credentials are checked by a server route. Protected pages require a signed HttpOnly cookie. Passwords and the signing secret are stored only in server environment variables. Without all three variables, login fails closed.

## Features

Responsive navigation, summary cards, monthly revenue chart toggle, additional pipeline and closing charts, recent activities, persistent local tasks, create-deal and task dialogs, CSV export, notification panel, and browser-data reset. The command palette and global search open from the header or with Ctrl/⌘ K. An onboarding tour opens on first use and can be replayed from the sidebar.

Mock seed data lives in `lib/data.ts`. New deals and tasks persist in localStorage. Summary revenue, historical trends, customer totals and pipeline distribution are illustrative fixtures, not live aggregates. Protected routes redirect to login without a valid admin session. Signing out clears the cookie.

## Customers and pipeline

The Customers section includes 12 mock records with permanent display IDs, combined search/status/industry filtering, name/company/status sorting, pagination, and detail views with company data, activity history, associated deals, and editable browser-persisted notes. The Deals section provides Lead, Contacted, Proposal, Negotiation, Won and Lost columns. Cards show customer, value and closing date; drag and drop or a stage selector moves a deal and persists the change. Value and closing-date filters narrow the board. Tasks can be filtered by status, priority, due date and search. Customer links open the corresponding details. Existing local deals are retained, and legacy Qualified deals migrate to Contacted. Customer and active-deal counts and pipeline values reflect the current data; historical revenue remains illustrative.

## Calendar and preferences

The calendar shows task due dates and deal closing dates with a selected-day agenda. Settings persist the profile, notification preferences, light/dark/system theme, four accent colors and English/Arabic interface preference in the browser. Arabic uses right-to-left layout and translated primary navigation and feature labels; mock record content remains in English. All data stays in this browser. This is a frontend demonstration with no backend.

## Screenshot

![Responsive login screen](docs/screenshots/login-desktop.jpg)

The owner-only preview is available at [Orbit CRM](https://orbit-crm-workspace-a9n.ahmedsamir83.chatgpt.site).

## Component architecture

- `app/` contains independent App Router pages and the static customer detail route.
- `components/dashboard-shell.tsx` checks the simulated browser session before mounting the workspace.
- `components/workspace.tsx` coordinates page state and shared chrome; feature views live in dedicated components such as `customer-views.tsx`, `deals-board.tsx`, `tasks-view.tsx`, `settings-view.tsx`, and `bonus-features.tsx`.
- `components/ui/index.tsx` exports reusable buttons, inputs, cards, tables, badges, modal, dropdown, search bar, pagination, empty state and loading skeleton.
- `lib/` holds typed mock customers, deals, tasks and preferences.
- `app/globals.css` defines the visual system and motion; Tailwind utility classes are also used in shared components. Motion respects `prefers-reduced-motion`.

## Deployment

The application uses Next.js server routes and middleware for admin login. In Vercel Project Settings → Environment Variables, set `ORBIT_ADMIN_EMAIL`, `ORBIT_ADMIN_PASSWORD`, and `ORBIT_SESSION_SECRET` for Production, then redeploy. Use the Next.js preset and default build/output settings; do not set an `out` directory. The sample customer records and client-side state remain demo data, not a multi-user backend. Anyone with access to the source can see the mock data bundled in the client; do not use real customer information. Customer IDs are read-only in the interface, not database-enforced identifiers.

## Verification

Run `npm run typecheck` and `npm run build`. The build generates all core routes, the bonus routes, and twelve customer detail pages. Check desktop, tablet and phone widths in a browser.
# SaaS subscriptions (setup in progress)

The public `/subscriptions` page lets a customer compare Starter, Pro and Business, switch between monthly and yearly preview prices, create an account, and save a plan preference to an isolated workspace. It does not collect payment or activate paid features. The existing admin dashboard still uses sample CRM records and browser storage; plan selection alone does not convert that dashboard into a multi-tenant product.

To enable account creation and saved choices:

1. Create a Supabase project and run [`docs/database-schema.sql`](docs/database-schema.sql) once in its SQL editor. Review its RLS policies before accepting customer data.
2. Set `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in Vercel for Production, Preview and Development as appropriate. Copy `.env.example` for local use. Do **not** expose a secret/service-role key to the browser or commit it.
3. Configure Supabase Auth email confirmation and its Site URL for your domain. Deploy after adding the variables.
4. Sign up on `/subscriptions`, confirm the email if required, sign in, then select a plan. Starter becomes active; Pro and Business are recorded as `selected` until real billing and entitlements are implemented.

The dollar prices and feature limits are illustrative product copy in `lib/plans.ts`; they do not enforce quotas. Before selling subscriptions, set actual prices, add a payment provider with verified webhooks, apply entitlements, move all CRM data operations to tenant-scoped server APIs, and add token refresh/session expiry handling. No payment credentials are needed for this plan-selection stage.

