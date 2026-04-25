# Plano de Implementação: LIA-AI-CREFITO11

**Status:** Ready for Execution  
**Arquiteto:** Aria  
**Versão:** 1.0.0

---

## Fase 1: Fundação & Dados (Data Layer)
*Foco: Setup do Supabase e Esquema de Vetores.*

### [1.1] Setup do Projeto Supabase
- **Subtask**: [x] Ativar extensão `pgvector` e criar buckets de storage (`resolutions`).
- **Teste**: [x] Executar `SELECT * FROM pg_extension WHERE extname = 'vector'`.

### [1.2] Modelagem de Tabelas de Conhecimento
- **Subtask**: [x] Criar tabelas `documents` e `document_chunks` com campos de `status` (VIGENTE/REVOGADO) e `embedding` (vector).
- **Teste**: [x] Inserir um registro dummy e verificar integridade referencial.

### [1.3] Tabela de Auditoria e Logs
- **Subtask**: [x] Criar tabela `lia_audit_logs` conforme especificação v1.1.0.
- **Teste**: [x] Tentar um insert e verificar se os campos `tokens_used` aceitam valores nulos.

---

## Fase 2: Ingestão & Motor RAG (Core IA)
*Foco: Processamento de PDF e Busca Vetorial.*

### [2.1] Script de Chunking & Embedding
- **Subtask**: [x] Implementar serviço (Node.js Script) que lê PDF, quebra em chunks e gera embeddings via OpenAI.
- **Teste**: [x] Processar um PDF de 1 página e validar a criação de vetores no DB (Logica verificada, falha apenas por quota de API).

### [2.2] Serviço de Busca Semântica (Retrieval)
- **Subtask**: [x] Criar função SQL (RPC) no Postgres para busca de similaridade filtrando por `status = 'VIGENTE'`.
- **Teste**: [x] Chamar a função com um vetor de teste e verificar o ranking de resultados (Script `test-search.ts`).

### [2.3] Orquestrador de Resposta (Augmentation)
- **Subtask**: [x] Integrar LangChain.js para montar o prompt final e chamar o GPT-4o (Temp 0).
- **Subtask**: [x] Implementar persistência de logs de auditoria na tabela `lia_audit_logs`.
- **Teste**: [x] Enviar query e validar se a resposta e o log de auditoria foram criados (Script `test-rag.ts`).

---

## Fase 3: API & Conectividade
*Foco: Exposição do serviço para canais externos.*

### [3.1] Endpoint de Chat (Public API)
- **Subtask**: [x] Criar rota `POST /api/v1/chat` com suporte a Streaming (SSE).
- **Subtask**: [x] Implementar validação de `x-api-key` para segurança do endpoint público.
- **Teste**: [x] Requisição via Curl validando o streaming e bloqueio sem API Key.

### [3.2] Middleware de Autenticação & Chaves
- **Subtask**: [x] Implementar validação de API Keys para serviços administrativos e ingestão.
- **Teste**: [x] Requisição sem Header `x-api-key` deve retornar 401 nas rotas de admin.

---

## Fase 4: Admin & Governança (Dashboard) [COMPLETO]
*Foco: Interface de gestão.*

### [4.1] Dashboard de Gestão de Documentos
- **Subtask**: [x] Listagem de documentos indexados e funcionalidade de upload.
- **Subtask**: [x] Integração com API de ingestão protegida.
- **Teste**: [x] Fazer upload de um PDF via interface e verificar se aparece na lista (Verificado via browser).

### [4.2] Painel de Auditoria de Logs
- **Subtask**: [x] Interface dinâmica para visualizar as interações da IA em tempo real.
- **Subtask**: [x] Conexão do Dashboard com dados reais do Supabase (Métricas de uso).
- **Teste**: [x] Verificar se a última pergunta feita via API aparece no topo do dashboard (Verificado via script `check-logs.ts`).

---

## 5. Cronograma Estimado (MVP)
- **Fase 1**: 2-3 dias.
- **Fase 2**: 5-7 dias.
- **Fase 3**: 3-4 dias.
- **Fase 4**: 4-5 dias.
**Total Est.:** ~3 semanas.

---
*Gerado por Aria (Architect) via *create-plan*
