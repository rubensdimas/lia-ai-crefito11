-- Tabela de Auditoria e Logs de interação da IA
CREATE TABLE public.lia_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT, -- ID do usuário (pode vir de sistemas externos ou Supabase Auth)
    prompt TEXT NOT NULL,
    llm_response TEXT,
    vector_chunks_ids UUID[], -- Array de IDs dos chunks utilizados no RAG
    tokens_used INTEGER, -- Deve aceitar NULL conforme requisito do teste
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ativa RLS para a tabela de auditoria
ALTER TABLE public.lia_audit_logs ENABLE ROW LEVEL SECURITY;
