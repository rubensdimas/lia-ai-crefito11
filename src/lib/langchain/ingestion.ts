import { createClient } from '@supabase/supabase-js';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { PDFParse } from 'pdf-parse';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const openaiApiKey = process.env.OPENAI_API_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const embeddings = new OpenAIEmbeddings({
  apiKey: openaiApiKey,
  model: 'text-embedding-3-small',
});

/**
 * Serviço de Ingestão de Documentos
 * Processa PDFs, gera embeddings e armazena no Supabase
 */
export async function ingestDocument(buffer: Buffer, title: string, fileName: string) {
  try {
    // 1. Parse PDF (pdf-parse roda nativamente no Node.js via serverExternalPackages)
    const parser = new PDFParse({ 
      data: new Uint8Array(buffer),
      verbosity: 0
    });
    
    const result = await parser.getText();
    const fullText = result.text;

    if (!fullText || fullText.trim().length === 0) {
      throw new Error('PDF extraído resultou em texto vazio.');
    }

    // 2. Split into Chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await splitter.splitText(fullText);

    // 3. Insert Document Record
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .insert({ title, source_url: fileName })
      .select()
      .single();

    if (docError) throw docError;

    // 4. Generate Embeddings and Insert Chunks
    // Processamos em lotes para evitar limites de taxa ou timeouts longos
    for (const [i, content] of chunks.entries()) {
      const embeddingVector = await embeddings.embedQuery(content);

      const { error: chunkError } = await supabase
        .from('document_chunks')
        .insert({
          document_id: doc.id,
          content,
          chunk_index: i,
          token_count: Math.ceil(content.length / 4),
          status: 'VIGENTE',
          embedding: embeddingVector,
        });

      if (chunkError) {
        console.error(`Erro ao inserir chunk ${i}:`, chunkError.message);
      }
    }

    return { success: true, documentId: doc.id, chunksProcessed: chunks.length };
  } catch (error: any) {
    console.error('Ingestion error:', error);
    throw error;
  }
}
