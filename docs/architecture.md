# Architecture Document - LIA-AI-CREFITO11

**Versão:** 1.0.0  
**Status:** Aprovado  
**Responsável:** Aria (Agente Architect)

---

## 1. Resumo Técnico
A **LIA** utiliza uma arquitetura moderna baseada em **Next.js (App Router)** e **Supabase**. O coração do sistema é um motor de **RAG (Retrieval-Augmented Generation)** que utiliza o **pgvector** dentro do PostgreSQL do Supabase para busca semântica em resoluções do COFFITO/CREFITO11. O sistema é projetado para ser "Stateless" no frontend e "Security-First" no backend via RLS (Row Level Security).

---

## 2. Tech Stack Definida

| Categoria | Tecnologia | Versão | Propósito |
| :--- | :--- | :--- | :--- |
| **Frontend** | Next.js (React) | 14.x+ | SSR, Performance e Edge Functions. |
| **Linguagem** | TypeScript | 5.x | Segurança de tipos em todo o projeto. |
| **Estilização** | Tailwind CSS | 3.x | Desenvolvimento rápido de UI responsiva. |
| **Backend/BaaS** | Supabase | LATEST | Auth, Database, Storage e Edge Functions. |
| **Vector DB** | pgvector | - | Extensão do Postgres para busca de embeddings. |
| **IA Framework**| LangChain.js | 0.1.x | Orquestração do pipeline de RAG e Chat. |
| **LLM Provider** | OpenAI / GPT-4o | - | Modelo de alta precisão (Temp 0). |
| **Deploy** | Vercel | - | Hospedagem global e CI/CD nativo. |

---

## 3. Fluxo de RAG (Retrieval-Augmented Generation)

O fluxo de consulta da LIA seguirá o padrão **Grounding Estrito**:

1.  **Ingestão**: PDFs de resoluções são processados, divididos em chunks (LangChain) e transformados em vetores (OpenAI Embeddings).
2.  **Armazenamento**: Vetores e metadados (nº da resolução, link do PDF) são salvos no **Supabase pgvector**.
3.  **Consulta (Query)**: O usuário pergunta -> A pergunta é vetorizada -> Busca de similaridade no pgvector (Top-K chunks).
4.  **Geração**: Prompt (Pergunta + Contexto dos Chunks + "Responda apenas com base no contexto") -> LLM (GPT-4o) -> Resposta com citação.

---

## 4. Segurança e Privacidade (LGPD)

### 4.1 Autenticação e Autorização
*   **Supabase Auth**: Gestão de usuários (e-mail/senha ou OAuth).
*   **Row Level Security (RLS)**: Cada profissional só pode acessar seu próprio histórico de chat e seus dados de registro consultados via ERP.

### 4.2 Segurança da IA
*   **Temperatura Zero**: Parâmetro  para garantir determinismo e evitar "alucinações".
*   **Prompt Shielding**: Camada de middleware para detectar tentativas de injeção de prompt.

---

## 5. Estrutura do Projeto (Monorepo-ish)

```plaintext
lia-ai-crefito11/
├── src/
│   ├── app/                # Next.js App Router (Pages & API)
│   ├── components/         # UI Components (Radix + Tailwind)
│   ├── lib/
│   │   ├── supabase/       # Clientes do Supabase (Client/Admin)
│   │   └── langchain/      # Cadeias de RAG e Chat
│   ├── services/           # Integração com ERP Externo
│   └── types/              # Definições globais de TypeScript
├── supabase/
│   ├── migrations/         # SQL para Tabelas, RLS e pgvector
│   └── functions/          # Edge Functions (Processamento de PDFs)
├── docs/                   # PRD, Arquitetura e Stories
└── tests/                  # Testes Unitários e E2E
```

---

## 6. Próximos Passos
1.  Configuração do projeto Supabase e ativação do `pgvector`.
2.  Criação das migrações de banco de dados por @data-engineer.
3.  Implementação do MVP de chat por @dev.

---
*Gerado por Synkra AIOX - Aria (Architect)*
