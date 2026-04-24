# PRD - LIA-AI-CREFITO11 (IA Generativa do Conselho)

**Versão:** 1.0.0  
**Status:** Rascunho  
**Responsável:** Morgan (Agente PM)

---

## 1. Visão Geral do Produto
A **LIA (Lógica de Inteligência Artificial)** é uma plataforma de IA Generativa projetada para o CREFITO11. O objetivo é automatizar o atendimento a fisioterapeutas e terapeutas ocupacionais, garantindo respostas baseadas estritamente em resoluções oficiais e dados do conselho.

### 1.1 Objetivos de Negócio
*   **Redução de Carga no Atendimento**: Automatizar 60% das dúvidas frequentes (FAQ).
*   **Acurácia Normativa**: Eliminar alucinações em respostas sobre ética e legislação profissional.
*   **Eficiência de Fiscalização**: Prover ferramentas de suporte à decisão para fiscais em campo.

---

## 2. Personas e Casos de Uso

### 2.1 Profissional (Fisioterapeuta / TO)
*   **Uso**: Consulta rápida a resoluções, procedimentos de registro e status de protocolo.
*   **Valor**: Respostas 24/7 com citação de fonte legal.

### 2.2 Fiscal
*   **Uso**: Análise preditiva de documentos de RT e consulta rápida a normas técnicas durante inspeções.
*   **Valor**: Ganho de tempo e precisão na fiscalização.

### 2.3 Administrativo
*   **Uso**: Triagem de tickets e automação de respostas baseadas em dados do ERP.
*   **Valor**: Redução de erros operacionais e fila de espera.

---

## 3. Requisitos Funcionais (MVP)

### RF01: Busca Semântica (RAG)
*   A LIA deve buscar informações em uma base de conhecimento (PDFs de Resoluções COFFITO/CREFITO11).
*   **Critério**: Toda resposta deve conter a citação da fonte (ex: Resolução 123/2023).

### RF02: Integração ERP (Consulta de Status)
*   Integração via API segura para consultar se o profissional está em dia com suas obrigações.
*   **Critério**: Dados sensíveis só aparecem após autenticação.

### RF03: Triagem de Atendimento
*   Se a dúvida for complexa ou subjetiva, a LIA deve gerar um ticket para atendimento humano.

---

## 4. Requisitos Não-Funcionais e Segurança

### RNF01: Zero Hallucination (Guardrails)
*   **Configuração**: LLM com Temperatura Zero.
*   **Fallback**: Se a resposta não estiver na base de conhecimento, a IA deve responder "Não possuo essa informação nos documentos oficiais".

### RNF02: Privacidade e LGPD
*   Mascaramento de dados pessoais (CPF, Endereço) em logs.
*   Acesso via JWT/Tokens para garantir que cada usuário veja apenas seus dados.

---

## 5. User Stories Iniciais

1.  **US1**: Como fisioterapeuta, quero perguntar sobre regras de publicidade para não cometer infrações éticas.
2.  **US2**: Como fiscal, quero consultar normas de Pilates durante uma fiscalização para agilizar o auto de infração.
3.  **US3**: Como usuário logado, quero ver o status da minha renovação de RT para evitar ligações ao conselho.

---

## 6. Próximos Passos
1.  Aprovação deste PRD.
2.  Definição da Arquitetura (Supabase + RAG Engine) pelo @architect.
3.  Criação das User Stories detalhadas no backlog.

---
*Gerado por Synkra AIOX - Morgan (PM)*
