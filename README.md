# Easy Leaderboard

Easy Leaderboard is a standalone Next.js + TypeScript app for golf tournament operations, including player score entry, live leaderboards, manager control workflows, handicap-aware history, team generation, payouts, and notification scaffolding.

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Supabase/PostgreSQL-ready schema (`supabase/schema.sql`)
- Supabase email/password authentication + role profile sync

## Folder Structure

- `app/` routes and API handlers
- `components/` shared UI + app state provider + role gate
- `lib/` domain models, seed data, scoring logic, permissions, team generation
- `supabase/` SQL schema + seed starter SQL
- `.env.example` environment variable template

## Implemented Feature Areas

- Real Supabase email/password auth (signup/login/session/signout)
- Role-based access gates (`player`, `manager`)
- Supabase-backed state API (`/api/state`) with automatic seed fallback
- Event management screen for managers
- Hole-by-hole score entry for players
- Player-only self-edit permission enforcement
- Manager score override support during live events
- Audit log capture for every score edit
- Live leaderboard computation (stroke play and stableford-aware)
- Team scoring computation scaffold
- Event details with tees/rules/team assignment
- Current-year history and handicap history views
- Team generator based on handicap + current-year scoring history
- Notification center with in-app delivery and SMS queue-ready status
- Money games module for small groups (`<= 50` participants) with buy-ins and payout config
- API scaffold endpoints for leaderboard read and notification enqueue

## Screens Included

### Public/Auth

- `/` Landing
- `/login`
- `/signup` (scaffold)
- `/forgot-password` (scaffold)

### Player

- `/player` dashboard
- `/player/events`
- `/player/money-games`
- `/player/events/[eventId]/score-entry`
- `/player/events/[eventId]/leaderboard`
- `/player/events/[eventId]/details`
- `/player/history`
- `/player/team`
- `/player/notifications`

### Manager

- `/manager` dashboard
- `/manager/events/new`
- `/manager/events/[eventId]/control-room`
- `/manager/players`
- `/manager/groups`
- `/manager/money-games`
- `/manager/leaderboards/[eventId]`
- `/manager/payouts`
- `/manager/team-generator`
- `/manager/history`
- `/manager/notifications`

## Data Model (App + SQL)

The app includes typed models and SQL schema for:

- users
- players
- managers
- golf clubs
- events
- courses
- tees
- scorecards
- hole scores (stored as arrays in this version)
- leaderboards (computed snapshots)
- player groups
- teams
- team memberships
- scoring rules
- payout rules
- handicap history
- event history
- notifications
- audit logs

## Supported Tournament/Scoring Formats

- Individual:
  - Stroke play / standard
  - Stableford
  - Skins-enabled configuration
  - Gross and net categories via rule config
- Team:
  - 2-man / 3-man / 4-man
  - 2-man scramble / 3-man scramble / 4-man scramble
  - 4-ball / best ball
  - Team-total variants
  - Custom team format enum placeholder

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Run development server:

```bash
npm run dev
```

4. Open `http://localhost:3000`

## Environment Variables

Required in `.env.local` (see `.env.example`):

- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ACCESS_TOKEN` (optional, for CLI operations)
- `SUPABASE_PROJECT_REF` (optional, for CLI operations)
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_MESSAGING_SERVICE_SID`

Money game limits:
- max players per money game is capped at 50 (enforced in API + DB constraint)

## Supabase / Postgres

1. Apply schema:

```bash
psql "$DATABASE_URL" -f supabase/schema.sql
```

2. Optional starter seed:

```bash
psql "$DATABASE_URL" -f supabase/seed.sql
```

If your Supabase tables are empty or schema is not yet applied, the app automatically falls back to in-app demo seed data so UI development can continue.

Supabase dashboard alternative:
1. Open SQL Editor in your Supabase project.
2. Run `supabase/schema.sql`.
3. Run `supabase/seed.sql`.

## Deployment Notes

- Vercel deployment works directly with Next.js app router.
- Configure environment variables in Vercel project settings.
- For production notifications, connect `app/api/notifications` to Twilio or another provider.
- Persist app state in Postgres instead of local client storage.

## Placeholder Integrations and Assumptions

- Auth uses Supabase email/password sessions; role profile records are synced via API.
- Notifications are fully implemented for in-app state; SMS is scaffolded queue-ready only.
- Leaderboard API currently reads seeded state; production should use DB-backed realtime updates.
- Hole scores are array-based for speed; can be normalized into `hole_scores` rows if needed.
- Team generation uses current-year gross averages + handicap index as balancing signals.

## Seed/Demo Data

Included in `lib/seed.ts`:

- 1 golf club
- 1 manager account
- 4 player accounts
- 2 events (individual live + team draft)
- scorecards, groups, teams, notifications, rules, payouts, and history records

Login is via email/password on `/login`.

## iOS TestFlight Release

The iOS wrapper is in:
- `ios/App/App.xcodeproj`

The Capacitor wrapper loads a URL:
- Dev default: `http://localhost:3000`
- Production: set `CAP_ENV=production` and `CAP_SERVER_URL=https://your-deployed-app-url`

Prepare iOS for production URL:

```bash
cd /Users/lukelovins/easy-leaderboard
CAP_SERVER_URL=https://your-domain.com npm run ios:prepare:prod
```

Then in Xcode:
1. Open `ios/App/App.xcodeproj`
2. Set `Bundle Identifier` (unique, e.g. `com.yourorg.easyleaderboard`)
3. Set `Team` and signing
4. Set `Version` and `Build`
5. Product -> Archive
6. In Organizer, Distribute App -> App Store Connect -> Upload
7. In App Store Connect, enable the uploaded build for TestFlight testing
