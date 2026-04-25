-- Função para busca semântica de fragmentos de documentos
-- Utiliza pgvector para calcular a similaridade de cosseno
-- Filtra por status 'VIGENTE' para garantir que apenas normas atuais sejam retornadas

CREATE OR REPLACE FUNCTION public.match_document_chunks (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  similarity FLOAT,
  document_title TEXT,
  document_source_url TEXT,
  chunk_index INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.content,
    1 - (dc.embedding <=> query_embedding) AS similarity,
    d.title AS document_title,
    d.source_url AS document_source_url,
    dc.chunk_index
  FROM public.document_chunks dc
  JOIN public.documents d ON d.id = dc.document_id
  WHERE dc.status = 'VIGENTE'
    AND 1 - (dc.embedding <=> query_embedding) > match_threshold
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
