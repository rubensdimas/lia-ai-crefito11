import { createClient } from '@supabase/supabase-js';
import { OpenAIEmbeddings } from '@langchain/openai';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const openaiApiKey = process.env.OPENAI_API_KEY || '';

if (!supabaseUrl || !supabaseServiceKey || !openaiApiKey) {
  console.error('❌ Missing environment variables. Check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const embeddings = new OpenAIEmbeddings({
  apiKey: openaiApiKey,
  model: 'text-embedding-3-small',
});

async function search(query: string) {
  try {
    console.log(`🔍 Searching for: "${query}"...`);

    // 1. Generate embedding for the query
    console.log('🧠 Generating query embedding...');
    const queryEmbedding = await embeddings.embedQuery(query);

    // 2. Call the RPC function
    console.log('📡 Calling match_document_chunks RPC...');
    const { data, error } = await supabase.rpc('match_document_chunks', {
      query_embedding: queryEmbedding,
      match_threshold: 0.2, // Limiar baixo para garantir resultados no teste inicial
      match_count: 5,
    });

    if (error) throw error;

    if (!data || data.length === 0) {
      console.log('⚠️ No results found. Ensure you have ingested documents and applied the migration.');
      return;
    }

    console.log(`✅ Found ${data.length} results:\n`);

    data.forEach((result: any, i: number) => {
      console.log(`[${i + 1}] Similarity: ${result.similarity.toFixed(4)}`);
      console.log(`📄 Document: ${result.document_title}`);
      console.log(`🔗 URL: ${result.document_source_url}`);
      console.log(`📝 Content: ${result.content.substring(0, 150)}...`);
      console.log('--------------------------------------------------');
    });

  } catch (error: any) {
    console.error('❌ Search failed:', error.message || error);
  }
}

// --- CLI Entry Point ---
const queryArg = process.argv.slice(2).join(' ');
if (!queryArg) {
  console.log('Usage: npx tsx src/scripts/test-search.ts "your search query"');
  process.exit(0);
}

search(queryArg);
