import * as fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import * as dotenv from 'dotenv';
import { PDFParse } from 'pdf-parse';

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

// --- Dry-run mode: skip embedding generation (useful when OpenAI quota is exhausted) ---
const DRY_RUN = process.argv.includes('--dry-run');

async function ingestPdf(filePath: string, title: string) {
  let parser: InstanceType<typeof PDFParse> | null = null;

  try {
    // --- Step 1: Read and Parse PDF ---
    console.log(`📄 Reading PDF: ${filePath}...`);
    const dataBuffer = fs.readFileSync(filePath);

    // pdf-parse v2: pass data as Uint8Array via LoadParameters
    parser = new PDFParse({ data: new Uint8Array(dataBuffer) });
    const result = await parser.getText();
    const fullText = result.text;

    if (!fullText || fullText.trim().length === 0) {
      console.warn('⚠️ PDF extraction resulted in empty text. Check the PDF content.');
      return;
    }

    console.log(`✅ Extracted ${fullText.length} characters from PDF.`);

    // --- Step 2: Split into Chunks ---
    console.log('✂️ Splitting text into chunks...');
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await splitter.splitText(fullText);
    console.log(`✅ Created ${chunks.length} chunks.`);

    // --- Step 3: Insert Document Record ---
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .insert({ title, source_url: filePath })
      .select()
      .single();

    if (docError) throw docError;
    console.log(`✅ Document created with ID: ${doc.id}`);

    // --- Step 4: Generate Embeddings and Insert Chunks ---
    if (DRY_RUN) {
      console.log('⏭️ DRY-RUN mode: skipping embedding generation. Inserting chunks without vectors...');
    } else {
      console.log('🧠 Generating embeddings and inserting chunks...');
    }

    let successCount = 0;

    for (const [i, content] of chunks.entries()) {
      try {
        let embeddingVector: number[] | undefined;

        if (!DRY_RUN) {
          embeddingVector = await embeddings.embedQuery(content);
        }

        const insertData: Record<string, unknown> = {
          document_id: doc.id,
          content,
          chunk_index: i,
          token_count: Math.ceil(content.length / 4),
          status: 'VIGENTE',
        };

        if (embeddingVector) {
          insertData.embedding = embeddingVector;
        }

        const { error: chunkError } = await supabase
          .from('document_chunks')
          .insert(insertData);

        if (chunkError) {
          console.error(`❌ Error inserting chunk ${i}:`, chunkError.message);
        } else {
          successCount++;
          console.log(`  ✅ Chunk ${i + 1}/${chunks.length} inserted.`);
        }
      } catch (embeddingError: any) {
        console.error(`❌ Embedding failed for chunk ${i}: ${embeddingError.message}`);
        throw embeddingError;
      }
    }

    console.log(`\n🎉 Ingestion completed! ${successCount}/${chunks.length} chunks inserted.`);
  } catch (error: any) {
    console.error('❌ Ingestion failed:', error.message || error);
    process.exit(1);
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
}

// --- CLI Entry Point ---
const args = process.argv.filter(a => !a.startsWith('--'));
const cliArgs = args.slice(2);

if (cliArgs.length < 2 || !cliArgs[0] || !cliArgs[1]) {
  console.log('Usage: npx tsx src/scripts/ingest.ts <pdf-path> "<title>" [--dry-run]');
  console.log('  --dry-run  Skip embedding generation (useful when OpenAI quota is exhausted)');
  process.exit(0);
} else {
  ingestPdf(cliArgs[0], cliArgs[1]);
}
