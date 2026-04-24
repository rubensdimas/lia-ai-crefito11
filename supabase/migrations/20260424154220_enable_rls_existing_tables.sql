-- Ativa Row Level Security para as tabelas existentes
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;

-- Nota: Como o acesso será via Service Role / Admin API da LIA, 
-- o RLS será bypassado nas conexões administrativas.
-- Para acesso via Client (anon/authenticated), políticas adicionais seriam necessárias.
