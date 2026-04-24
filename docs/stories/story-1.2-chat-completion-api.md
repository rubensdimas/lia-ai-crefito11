# User Story 1.2: Chat Completion API Endpoint

**Épico:** 01 - Core Engine & Chat API  
**Status:** Ready for Dev  
**Estimativa:** Medium

## 📝 Descrição
Como um serviço externo (ex: Integração WhatsApp/Twilio), quero consumir o motor da LIA via endpoint POST, para enviar mensagens e receber respostas estruturadas da IA.

## 🎯 Critérios de Aceite
1.  **Endpoint**: Criar rota `POST /api/v1/chat`.
2.  **Request**: Deve aceitar JSON com `message`, `userId` e opcionalmente `sessionId`.
3.  **Response**: Deve retornar JSON com `reply`, `sources` (lista de fontes) e `processingTime`.
4.  **Streaming**: Suporte opcional a SSE (Server-Sent Events) para respostas em tempo real.

## ✅ Definition of Done (DoD)
- [ ] Rota funcional e testada via Insomnia/Postman.
- [ ] Tratamento de erros para "Base de conhecimento offline".
- [ ] Rate limiting básico configurado.
