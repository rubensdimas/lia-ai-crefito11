import { RagEngine } from '@/lib/langchain/engine';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

/**
 * Endpoint de Chat da LIA (v1)
 * Suporta streaming via Server-Sent Events (SSE)
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Validação de API Key
    const apiKey = req.headers.get('x-api-key');
    const validApiKey = process.env.LIA_API_KEY || 'lia_test_key_123';

    if (apiKey !== validApiKey) {
      return new Response(JSON.stringify({ error: 'Não autorizado. API Key inválida.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { message, userId } = body;

    if (!message) {
      return new Response(JSON.stringify({ error: 'Mensagem é obrigatória.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const engine = new RagEngine();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Itera sobre o gerador de streaming do RagEngine
          for await (const chunk of engine.streamAnswer(message, userId)) {
            const data = JSON.stringify(chunk);
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
          controller.close();
        } catch (error: any) {
          console.error('Streaming error:', error);
          const errorData = JSON.stringify({ type: 'error', content: error.message || 'Erro no streaming' });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('API Route Error:', error);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
