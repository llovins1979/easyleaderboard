import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export async function GET(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ message: 'Supabase is not configured.' }, { status: 400 });
  }

  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
  if (!token) return NextResponse.json({ message: 'Missing access token.' }, { status: 401 });

  const supabase = createSupabaseAdmin();
  const userRes = await supabase.auth.getUser(token);
  if (!userRes.data.user) return NextResponse.json({ message: 'Invalid auth token.' }, { status: 401 });

  const profileRes = await supabase.from('users').select('*').eq('id', userRes.data.user.id).maybeSingle();

  return NextResponse.json({ authUser: userRes.data.user, profile: profileRes.data ?? null });
}
