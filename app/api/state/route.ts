import { NextResponse } from 'next/server';
import { loadAppState } from '@/lib/supabase/state';

export async function GET() {
  const { state, source } = await loadAppState();
  return NextResponse.json({ source, state });
}
