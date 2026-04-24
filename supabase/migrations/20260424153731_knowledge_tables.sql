-- Enum para o status dos documentos e chunks
CREATE TYPE document_status AS ENUM ('VIGENTE', 'REVOGADO', 'SUBSTITUÍDO');

-- Tabela principal de Documentos
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    source_url TEXT, -- Referência ao arquivo no bucket 'resolutions'
    status document_status DEFAULT 'VIGENTE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de fragmentos vetoriais
CREATE TABLE public.document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding VECTOR(1536), -- Ajustado para padrão OpenAI
    status document_status DEFAULT 'VIGENTE', -- Desnormalizado para otimização do filtro na busca RAG
    chunk_index INTEGER NOT NULL,
    token_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indice HNSW para busca vetorial rápida usando a métrica de cosine similarity (padrão OpenAI)
CREATE INDEX ON public.document_chunks USING hnsw (embedding vector_cosine_ops);
