import 'dotenv/config';
import { supabaseAdmin } from './src/lib/supabase/admin.js';

async function checkLogs() {
  const { data, error } = await supabaseAdmin
    .from('lia_audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching logs:', error);
  } else {
    console.log('Recent Audit Logs:');
    console.table(data.map(l => ({
      id: l.id,
      prompt: l.prompt,
      response: l.llm_response?.substring(0, 30),
      created_at: l.created_at
    })));
  }
}

checkLogs();
