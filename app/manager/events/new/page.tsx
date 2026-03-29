'use client';

import { FormEvent, useState } from 'react';
import { RoleGate } from '@/components/role-gate';
import { useAppState } from '@/components/app-state';
import { EventType, ScoringMethod, TeamFormat } from '@/lib/types';

const scoringMethods: ScoringMethod[] = ['stroke_play', 'stableford', 'best_ball', 'scramble', 'team_total'];
const teamFormats: TeamFormat[] = [
  '2_man',
  '3_man',
  '4_man',
  '2_man_scramble',
  '3_man_scramble',
  '4_man_scramble',
  '4_ball',
  'custom'
];

export default function CreateEventPage() {
  const { state, createEvent } = useAppState();
  const [name, setName] = useState('');
  const [eventType, setEventType] = useState<EventType>('individual');
  const [teamFormat, setTeamFormat] = useState<TeamFormat>('2_man');
  const [scoringMethod, setScoringMethod] = useState<ScoringMethod>('stroke_play');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createEvent({
      clubId: state.golfClubs[0].id,
      name,
      courseId: state.courses[0].id,
      teeId: state.tees[0].id,
      date: new Date().toISOString().slice(0, 10),
      status: 'draft',
      eventType,
      teamFormat: eventType === 'team' ? teamFormat : undefined,
      scoringMethod,
      rulesText: 'Configured via manager setup page.',
      playerIds: state.players.map((p) => p.id)
    });

    setName('');
  };

  return (
    <RoleGate allow="manager">
      <div className="card max-w-2xl">
        <h1 className="text-2xl font-semibold">Create Event</h1>
        <form className="mt-4 grid gap-3" onSubmit={onSubmit}>
          <label className="text-sm">
            Event Name
            <input className="mt-1 w-full rounded border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="text-sm">
            Event Type
            <select className="mt-1 w-full rounded border px-3 py-2" value={eventType} onChange={(e) => setEventType(e.target.value as EventType)}>
              <option value="individual">Individual</option>
              <option value="team">Team</option>
            </select>
          </label>
          {eventType === 'team' && (
            <label className="text-sm">
              Team Format
              <select className="mt-1 w-full rounded border px-3 py-2" value={teamFormat} onChange={(e) => setTeamFormat(e.target.value as TeamFormat)}>
                {teamFormats.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </label>
          )}
          <label className="text-sm">
            Scoring Method
            <select className="mt-1 w-full rounded border px-3 py-2" value={scoringMethod} onChange={(e) => setScoringMethod(e.target.value as ScoringMethod)}>
              {scoringMethods.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>
          <button className="rounded bg-brand-700 px-4 py-2 text-white" type="submit">Create</button>
        </form>
      </div>
    </RoleGate>
  );
}
