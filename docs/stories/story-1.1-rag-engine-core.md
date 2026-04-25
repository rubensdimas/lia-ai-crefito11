# User Story 1.1: Core RAG Engine Implementation

**Épico:** 01 - Core Engine & Chat API  
**Status:** Ready for Dev  
**Estimativa:** Large

## 📝 Descrição
Como desenvolvedor do ecossistema CREFITO11, quero que a LIA processe perguntas e busque respostas baseadas em documentos oficiais (PDFs) usando busca vetorial (pgvector), para garantir que a base de conhecimento seja a única fonte de verdade.

## 🎯 Critérios de Aceite
1.  **Vetorização**: O sistema deve converter chunks de texto de resoluções em vetores usando OpenAI Embeddings.
2.  **Busca de Similaridade**: Ao receber uma query, o sistema deve retornar os 3 chunks mais relevantes do `pgvector` com score > 0.75.
3.  **Prompt de Grounding**: O prompt enviado ao LLM deve conter instruções explícitas para "Não responder se não houver contexto" e "Citar a resolução/ano".
4.  **Citações**: A resposta gerada deve incluir metadados da fonte (ex: Resolução 123/2023).

## ✅ Definition of Done (DoD)
- [x] Código versionado e revisado.
- [x] Teste de integração validando busca no banco de dados (RPC match_document_chunks).
- [x] Documentação do esquema da tabela de vetores concluída.

## Dev Agent Record

### File List
- `supabase/config.toml` (novo)
- `supabase/migrations/20260424153210_setup_vector_and_storage.sql` (novo)
- `supabase/migrations/20260424153731_knowledge_tables.sql` (novo)
- `supabase/migrations/20260424154220_enable_rls_existing_tables.sql` (novo)
- `supabase/migrations/20260424154245_audit_logs.sql` (novo)
- `supabase/migrations/20260425080000_match_document_chunks.sql` (novo)
- `src/scripts/ingest.ts` (novo)
- `src/scripts/test-search.ts` (novo)
- `src/scripts/test-rag.ts` (novo)
- `src/lib/supabase/client.ts` (novo)
- `src/lib/langchain/engine.ts` (novo)
- `package.json` (atualizado)
- `tsconfig.json` (novo)

### Completion Notes
- Inicializou o Supabase local.
- Criou a migration inicial configurando a extensão `pgvector` e criando o bucket público `resolutions`.
- Validou localmente a ativação da extensão e a criação do bucket.
- Criou a migration `knowledge_tables` estruturando `documents` e `document_chunks`.
- Criou o índice vetorial `HNSW` com dimensão 1536 e filtro otimizado de status nas duas tabelas.
- Validou as tabelas com um registro dummy e o trigger/constraint referencial funcionou conforme o esperado.
- Ativou Row Level Security (RLS) em todas as tabelas criadas (`documents`, `document_chunks`, `lia_audit_logs`).
- Criou a tabela `lia_audit_logs` para rastreio de auditoria e consumo de tokens, permitindo valores nulos em `tokens_used`.
- Inicializou o projeto Node.js com suporte a ESM e TypeScript.
- Implementou o script `src/scripts/ingest.ts` utilizando a versão moderna do `pdf-parse` e o `text-splitter` da LangChain.
- O script foi validado com sucesso na extração de texto de PDF e criação do registro em `documents`.
- Implementada a função RPC `match_document_chunks` para busca semântica com filtro de status 'VIGENTE'.
- Implementado o `RagEngine` utilizando LangChain.js para orquestração de busca e geração de respostas com citações.
- Criados scripts de teste `test-search.ts` e `test-rag.ts` para validação local.

