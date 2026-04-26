# LIA AI - CREFITO11

> Solução inteligente para o CREFITO-11, desenvolvida com Synkra AIOX.

Este projeto utiliza **Next.js**, **Supabase** e **LangChain** para fornecer uma interface de inteligência artificial otimizada para as necessidades do CREFITO-11.

## 🚀 Como Rodar o Projeto Localmente

Siga os passos abaixo para configurar seu ambiente de desenvolvimento:

### 1. Pré-requisitos

Certifique-se de ter instalado:
- **Node.js** (v18 ou superior recomendado)
- **npm** (geralmente instalado com o Node)
- **Git**

### 2. Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd lia-ai-crefito11
```

### 3. Configurar o Banco de Dados (Supabase Local)

O projeto utiliza o Supabase para banco de dados, autenticação e storage. Para rodar localmente via Docker:

1. **Certifique-se de que o Docker Desktop esteja rodando.**
2. **Inicie o stack do Supabase:**
   ```bash
   npx supabase start
   ```
   *Este comando irá baixar as imagens Docker necessárias, iniciar os serviços, **gerar automaticamente** as chaves de acesso e **aplicar todas as migrations** existentes na pasta `supabase/migrations`.*

3. **Anote as credenciais locais:**
   Ao final do processo, o CLI exibirá uma tabela com as URLs e chaves. Você precisará dos seguintes valores para o seu arquivo `.env`:

   | Campo no CLI | Variável no .env | Exemplo de Valor |
   | :--- | :--- | :--- |
   | **Project URL** | `SUPABASE_URL` | `http://127.0.0.1:54321` |
   | **Publishable** | `SUPABASE_ANON_KEY` | `sb_publishable_...` |
   | **Secret** | `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_...` |

   *Dica: Se precisar consultar esses valores novamente, execute `npx supabase status`.*

### 4. Configurar Variáveis de Ambiente

O projeto depende de várias chaves de API.

1. Copie o arquivo de exemplo para um arquivo `.env`:
   ```bash
   cp .env.example .env
   ```
2. Abra o arquivo `.env` e preencha as variáveis com os valores obtidos no passo anterior:
   - `SUPABASE_URL`: Use o `API URL` do Supabase local.
   - `SUPABASE_ANON_KEY`: Use a `anon key` do Supabase local.
   - `SUPABASE_SERVICE_ROLE_KEY`: Use a `service_role key`.
   - `OPENAI_API_KEY`: Sua chave da OpenAI (necessária para as funções de IA).

### 5. Instalar Dependências e Rodar o App

```bash
npm install
npm run dev
```

O servidor estará disponível em [http://localhost:3000](http://localhost:3000).

---

## 🏗️ Estrutura do Projeto

- `src/app`: Páginas e componentes do Next.js (App Router).
- `src/lib`: Utilitários e integrações (Supabase, LangChain).
- `supabase/`: Migrações e configurações do banco de dados.
- `docs/`: Documentação técnica, requisitos e histórias de usuário.

## 🛠️ Comandos Disponíveis

- `npm run dev`: Inicia o ambiente de desenvolvimento.
- `npm run build`: Cria a versão de produção do projeto.
- `npm run start`: Inicia o servidor em modo produção.
- `npm run test`: Executa os testes (quando disponíveis).

## 📄 Documentação Adicional

- [PRD (Product Requirements Document)](docs/prd.md)
- [Arquitetura do Sistema](docs/architecture.md)
- [Plano de Implementação](docs/implementation-plan.md)

---
*Gerado por Orion Master Orchestrator via Synkra AIOX*
