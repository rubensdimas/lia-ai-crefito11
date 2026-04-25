import 'dotenv/config';
import { RagEngine } from '../lib/langchain/engine';

async function main() {
  const query = process.argv.slice(2).join(' ');
  
  if (!query) {
    console.log('Usage: npx tsx src/scripts/test-rag.ts "sua pergunta aqui"');
    process.exit(0);
  }

  const engine = new RagEngine();

  try {
    console.log(`🤔 Pergunta: "${query}"`);
    console.log('⏳ LIA está pensando...');
    
    const result = await engine.answer(query);

    console.log('\n🤖 RESPOSTA DA LIA:');
    console.log('--------------------------------------------------');
    console.log(result.answer);
    console.log('--------------------------------------------------');
    
    if (result.sources.length > 0) {
      console.log('\n📚 FONTES UTILIZADAS:');
      const uniqueSources = Array.from(new Set(result.sources.map(s => s.title)))
        .map(title => result.sources.find(s => s.title === title));
        
      uniqueSources.forEach(source => {
        console.log(`- ${source?.title} (${source?.url})`);
      });
    }
  } catch (error: any) {
    console.error('❌ Erro no processamento RAG:', error.message || error);
  }
}

main();
