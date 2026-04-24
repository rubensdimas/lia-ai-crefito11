-- Ativa a extensão pgvector
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;

-- Configura Storage e políticas para o bucket 'resolutions'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resolutions', 'resolutions', true)
ON CONFLICT (id) DO NOTHING;
