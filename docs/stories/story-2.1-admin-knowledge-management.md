# User Story 2.1: Admin Knowledge Management Dashboard

**Épico:** 02 - Admin Dashboard & Knowledge Ops  
**Status:** Ready for Dev  
**Estimativa:** Medium

## 📝 Descrição
Como administrador do CREFITO11, quero um painel web para fazer upload de novas resoluções e gerenciar o que a LIA "sabe", para manter a base de conhecimento sempre atualizada.

## 🎯 Critérios de Aceite
1.  **Upload de PDF**: Interface para upload de arquivos .pdf.
2.  **Fila de Processamento**: Visualização do status da ingestão (Pendente, Processando, Indexado).
3.  **Exclusão**: Possibilidade de remover documentos e seus respectivos vetores do banco.
4.  **Lista de Documentos**: Tabela listando documentos indexados e data da última atualização.

## ✅ Definition of Done (DoD)
- [ ] Interface administrativa protegida por senha/permissão.
- [ ] Integração com Supabase Storage funcional.
- [ ] Gatilho para re-indexação de vetores testado.
