import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Proxy de Autenticação da LIA (Substituto do Middleware no Next.js 16)
 * Verifica o cabeçalho 'x-api-key' para todas as requisições em /api/v1/* e /api/admin/*
 */
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protege rotas da API v1 e Admin
  if (path.startsWith('/api/v1/') || path.startsWith('/api/admin/')) {
    const apiKey = request.headers.get('x-api-key');
    const validApiKey = process.env.LIA_API_KEY;

    // Se a chave for inválida ou ausente, retorna 401
    if (!apiKey || apiKey !== validApiKey) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Não autorizado: Chave de API ausente ou inválida.',
          hint: 'Certifique-se de enviar o cabeçalho x-api-key.'
        }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
  }

  return NextResponse.next();
}

// Configura o matcher para aplicar o middleware em rotas de API
export const config = {
  matcher: ['/api/v1/:path*', '/api/admin/:path*'],
};
