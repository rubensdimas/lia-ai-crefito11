# Test Design: LIA-AI-CREFITO11

**Versão:** 1.0.0  
**Status:** Ready for execution  
**Responsável:** Quinn (Agente QA)

---

## 1. Estratégia de Testes

### 1.1 Pirâmide de Testes
*   **Unitários (60%)**: Lógica de chunking, sanitização de strings e validação de tokens.
*   **Integração (30%)**: Comunicação entre Next.js API -> Supabase (pgvector) -> OpenAI.
*   **E2E/API (10%)**: Endpoints públicos de chat e dashboard administrativo.

---

## 2. Cenários de Teste Detalhados

### 2.1 Motor de RAG (Core)

| ID | Cenário | Resultado Esperado | Prioridade |
| :--- | :--- | :--- | :--- |
| T-RAG-01 | Ingestão de PDF complexo (múltiplas páginas). | Documento quebrado em chunks sem perda de texto. | P0 |
| T-RAG-02 | Busca de similaridade com pergunta ambígua. | Retorno dos chunks mais próximos via pgvector. | P0 |
| T-RAG-03 | Resposta com base em contexto (Grounding). | Resposta contém trechos da resolução e citação. | P0 |
| T-RAG-04 | Documento Revogado. | IA ignora o documento marcado como 'REVOGADO' na busca. | P0 |

### 2.2 API & Segurança

| ID | Cenário | Resultado Esperado | Prioridade |
| :--- | :--- | :--- | :--- |
| T-SEC-01 | Acesso sem API Key. | Retorno HTTP 401 Unauthorized. | P0 |
| T-SEC-02 | Prompt Injection (Jailbreak). | IA recusa o comando e mantém o System Prompt. | P0 |
| T-SEC-03 | Injeção de SQL/Comandos. | Sanitização bloqueia o input ou erro controlado. | P1 |
| T-SEC-04 | Auditoria de Logs. | Verificação se a entrada/saída foi salva em `lia_audit_logs`. | P1 |

### 2.3 Performance & Cache

| ID | Cenário | Resultado Esperado | Prioridade |
| :--- | :--- | :--- | :--- |
| T-PERF-01 | Hit de Cache (Pergunta repetida). | Resposta em < 1s sem chamada extra ao LLM. | P1 |
| T-PERF-02 | Streaming de Resposta. | Resposta chega em pedaços (tokens) via SSE. | P1 |

---

## 3. Matriz de Rastreabilidade (Traceability)

| Requisito | Teste Associado |
| :--- | :--- |
| FR-1 (Ingestão) | T-RAG-01, T-RAG-04 |
| FR-2 (API Chat) | T-SEC-01, T-PERF-02 |
| FR-3 (pgvector) | T-RAG-02 |
| FR-6 (Auditoria) | T-SEC-04 |
| NFR-1 (Zero Alucinação) | T-RAG-03 |

---

## 4. Ferramentas de Teste
*   **Jest / Vitest**: Testes unitários e de integração.
*   **Playwright**: Testes de API e E2E no Dashboard.
*   **Insomnia/Postman**: Validação manual inicial dos endpoints.

---
*Gerado por Quinn (QA) - Plano de Testes v1.0*
