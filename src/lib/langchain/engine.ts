import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';
import { supabaseAdmin } from '../supabase/client';

export interface SearchResult {
  id: string;
  content: string;
  similarity: number;
  document_title: string;
  document_source_url: string;
}

const RAG_PROMPT_TEMPLATE = `
Você é a LIA (Lógica de Inteligência Artificial), a assistente virtual oficial do CREFITO11.
Sua missão é responder dúvidas de profissionais (fisioterapeutas e terapeutas ocupacionais) com base estritamente nos documentos oficiais fornecidos.

CONTEXTO:
{context}

PERGUNTA: 
{question}

INSTRUÇÕES CRÍTICAS:
1. Responda APENAS com base no contexto fornecido acima.
2. Se a resposta não estiver no contexto, diga exatamente: "Não possuo essa informação nos documentos oficiais disponíveis no momento."
3. Sempre cite a fonte da informação (ex: "De acordo com a Resolução COFFITO nº 123/2023...").
4. Mantenha um tom profissional, prestativo e objetivo.
5. Não utilize conhecimentos externos que não estejam nos fragmentos acima.

RESPOSTA:
`;

export class RagEngine {
  private model: ChatOpenAI;
  private embeddings: OpenAIEmbeddings;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: 'gpt-4o',
      temperature: 0,
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.embeddings = new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY,
      model: 'text-embedding-3-small',
    });
  }

  /**
   * Busca os fragmentos mais relevantes no Supabase
   */
  async retrieve(query: string, matchThreshold = 0.5, matchCount = 3): Promise<SearchResult[]> {
    const queryEmbedding = await this.embeddings.embedQuery(query);

    const { data, error } = await supabaseAdmin.rpc('match_document_chunks', {
      query_embedding: queryEmbedding,
      match_threshold: matchThreshold,
      match_count: matchCount,
    });

    if (error) {
      console.error('Error in retrieval:', error);
      throw new Error(`Failed to retrieve context: ${error.message}`);
    }

    return data as SearchResult[];
  }

  /**
   * Formata os resultados da busca para o prompt
   */
  private formatDocs(docs: SearchResult[]): string {
    return docs
      .map((doc) => `FONTE: ${doc.document_title}\nCONTEÚDO: ${doc.content}`)
      .join('\n\n---\n\n');
  }

  /**
   * Grava o log de auditoria no Supabase
   */
  async saveAuditLog(params: {
    userId?: string | undefined;
    prompt: string;
    response: string;
    chunksIds?: string[] | undefined;
    tokensUsed?: number | undefined;
  }) {
    try {
      const { error } = await supabaseAdmin.from('lia_audit_logs').insert({
        user_id: params.userId,
        prompt: params.prompt,
        llm_response: params.response,
        vector_chunks_ids: params.chunksIds,
        tokens_used: params.tokensUsed,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to save audit log:', error);
      // Não lançamos erro aqui para não quebrar a resposta ao usuário
    }
  }

  /**
   * Executa o fluxo completo de RAG
   */
  async answer(question: string, userId?: string) {
    const contextDocs = await this.retrieve(question);
    
    if (!contextDocs || contextDocs.length === 0) {
      const response = "Não possuo essa informação nos documentos oficiais disponíveis no momento.";
      await this.saveAuditLog({ userId, prompt: question, response });
      return {
        answer: response,
        sources: [],
      };
    }

    const contextText = this.formatDocs(contextDocs);
    const prompt = PromptTemplate.fromTemplate(RAG_PROMPT_TEMPLATE);
    
    const chain = RunnableSequence.from([
      {
        context: () => contextText,
        question: new RunnablePassthrough(),
      },
      prompt,
      this.model,
      new StringOutputParser(),
    ]);

    const response = await chain.invoke(question);

    // Grava log assincronamente
    this.saveAuditLog({
      userId,
      prompt: question,
      response,
      chunksIds: contextDocs.map(d => d.id),
    });

    return {
      answer: response,
      sources: contextDocs.map(d => ({
        title: d.document_title,
        url: d.document_source_url
      })),
    };
  }

  /**
   * Executa o fluxo de RAG com suporte a streaming
   */
  async *streamAnswer(question: string, userId?: string) {
    const contextDocs = await this.retrieve(question);
    
    if (!contextDocs || contextDocs.length === 0) {
      const response = "Não possuo essa informação nos documentos oficiais disponíveis no momento.";
      yield { type: 'text', content: response };
      await this.saveAuditLog({ userId, prompt: question, response });
      return;
    }

    const contextText = this.formatDocs(contextDocs);
    const prompt = PromptTemplate.fromTemplate(RAG_PROMPT_TEMPLATE);
    
    const chain = RunnableSequence.from([
      {
        context: () => contextText,
        question: new RunnablePassthrough(),
      },
      prompt,
      this.model,
      new StringOutputParser(),
    ]);

    // Send sources first
    yield {
      type: 'sources',
      content: contextDocs.map(d => ({
        title: d.document_title,
        url: d.document_source_url
      }))
    };

    // Stream the response and accumulate for logging
    let fullResponse = '';
    const stream = await chain.stream(question);
    for await (const chunk of stream) {
      fullResponse += chunk;
      yield {
        type: 'text',
        content: chunk
      };
    }

    // Grava log após o fim do streaming
    this.saveAuditLog({
      userId,
      prompt: question,
      response: fullResponse,
      chunksIds: contextDocs.map(d => d.id),
    });
  }
}
