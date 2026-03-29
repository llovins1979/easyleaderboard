import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-4">
      <section className="rounded-xl bg-gradient-to-r from-brand-900 via-brand-700 to-brand-500 p-6 text-white">
        <h1 className="text-3xl font-bold">Easy Leaderboard</h1>
        <p className="mt-2 max-w-3xl text-sm md:text-base">
          Mobile-first golf event scoring, live leaderboards, team generation, handicap-aware operations,
          and tournament-day control tools for clubs and managers.
        </p>
        <div className="mt-4 flex gap-2">
          <Link href="/login" className="rounded bg-white px-3 py-2 text-sm font-medium text-brand-900">
            Sign In
          </Link>
          <Link href="/signup" className="rounded border border-white px-3 py-2 text-sm">
            Create Account
          </Link>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="card">
          <h2 className="font-semibold">Player Workflows</h2>
          <ul className="mt-2 list-disc pl-5 text-sm">
            <li>Hole-by-hole score entry</li>
            <li>Live event leaderboard and team status</li>
            <li>Own-score-only editing with audit history</li>
            <li>Rules, tees, assignments, and notifications</li>
          </ul>
        </div>
        <div className="card">
          <h2 className="font-semibold">Manager Operations</h2>
          <ul className="mt-2 list-disc pl-5 text-sm">
            <li>Event and scoring rule configuration</li>
            <li>Live score control room + override edits</li>
            <li>Groups/flights, payouts, skins, and winner logic</li>
            <li>Current-year history driven team generation</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
