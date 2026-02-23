import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req: Request) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  
  try {
    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    // Delete all assessment sessions for this project
    const { error } = await supabase
      .from('assessment_sessions')
      .delete()
      .eq('project_id', projectId);

    if (error) throw error;

    // Reset project status if needed (optional, keeping it simple for now)
    // await supabase.from('Project').update({ status: 'PLANNING' }).eq('id', projectId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Reset error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}