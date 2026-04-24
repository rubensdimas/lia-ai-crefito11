# User Story 3.1: API Authentication & Service Keys

**Épico:** 03 - Connectivity & ERP Integration  
**Status:** Ready for Dev  
**Estimativa:** Small

## 📝 Descrição
Como arquiteto de segurança, quero que o acesso à API da LIA seja protegido por API Keys ou JWT, para que apenas serviços autorizados e usuários autenticados possam consumir o serviço.

## 🎯 Critérios de Aceite
1.  **Geração de Keys**: Admin pode gerar chaves de serviço para o WhatsApp Bot.
2.  **Validação Middleware**: Todas as rotas `/api/v1/*` devem exigir Header `x-api-key`.
3.  **Contexto do Usuário**: Se a chave for de um usuário final (via WhatsApp), o `userId` deve ser validado no Supabase Auth.

## ✅ Definition of Done (DoD)
- [ ] Middleware de autenticação implementado.
- [ ] Tentativa de acesso sem chave retorna 401 Unauthorized.
