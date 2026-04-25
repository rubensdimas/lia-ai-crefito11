import { NextRequest, NextResponse } from 'next/server';
import { ingestDocument } from '@/lib/langchain/ingestion';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutos de limite para processamento de PDF

/**
 * API para Ingestão de Documentos via Admin
 * Recebe um arquivo PDF e um título, processa e armazena no Supabase
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Validação de API Key (Admin)
    const apiKey = req.headers.get('x-api-key');
    const validApiKey = process.env.LIA_ADMIN_KEY || 'lia_test_key_123';

    if (apiKey !== validApiKey) {
      return NextResponse.json(
        { error: 'Não autorizado. Acesso restrito ao administrador.' }, 
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;

    if (!file || !title) {
      return NextResponse.json(
        { error: 'Arquivo e título são obrigatórios.' }, 
        { status: 400 }
      );
    }

    if (!file.name.endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Apenas arquivos PDF são suportados no momento.' }, 
        { status: 400 }
      );
    }

    console.log(`📥 Iniciando ingestão do arquivo: ${file.name} com título: ${title}`);

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await ingestDocument(buffer, title, file.name);

    console.log(`✅ Ingestão concluída: ${result.documentId}`);

    return NextResponse.json({
      message: 'Documento processado e indexado com sucesso.',
      ...result
    });
  } catch (error: any) {
    console.error('❌ Erro na API de Ingestão:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno no processamento do documento.' }, 
      { status: 500 }
    );
  }
}
