import 'dotenv/config';

async function testApi() {
  const apiKey = process.env.LIA_API_KEY || '';
  
  console.log('🛑 Teste 1: Chamando API SEM x-api-key...');
  try {
    const response = await fetch('http://localhost:3000/api/v1/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Olá' }),
    });
    console.log(`Status: ${response.status}`);
    const data = await response.json();
    console.log('Resposta:', JSON.stringify(data, null, 2));
  } catch (error: any) {
    console.error('Erro:', error.message);
  }

  console.log('\n📡 Teste 2: Chamando API COM x-api-key correta...');
  try {
    const response = await fetch('http://localhost:3000/api/v1/chat', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({ message: 'O que é o documento de teste?' }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('ReadableStream not supported');

    const textDecoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      process.stdout.write(textDecoder.decode(value));
    }
    
    console.log('\n\n✅ Testes concluídos com sucesso.');
  } catch (error: any) {
    console.error('\n❌ Erro no teste da API:', error.message);
  }
}

testApi();
