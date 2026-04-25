'use client';

import { useState } from 'react';
import { Upload, X, Loader2, CheckCircle2 } from 'lucide-react';

/**
 * Componente de Upload de Documentos
 * Gerencia o estado do modal, seleção de arquivo e chamada para a API de ingestão
 */
export default function UploadButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    setIsLoading(true);
    setStatus('idle');
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    try {
      const res = await fetch('/api/admin/documents/ingest', {
        method: 'POST',
        headers: {
          // Nota: Em um sistema real, usaríamos autenticação via Cookie/JWT.
          // Para este protótipo, usamos a chave de teste no header.
          'x-api-key': 'lia_test_key_123',
        },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro no upload');
      }

      setStatus('success');
      setFile(null);
      setTitle('');
      
      // Fecha o modal e recarrega após 2 segundos
      setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button className="btn-primary" onClick={() => setIsOpen(true)}>
        <Upload size={20} />
        Novo Documento
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(8px)'
        }}>
          <div className="card glass animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Adicionar Documento</h2>
              <button onClick={() => setIsOpen(false)} style={{ color: '#94a3b8' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#94a3b8' }}>Título da Resolução</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Resolução CREFITO 11 nº 123/2024"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '0.85rem',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '1rem'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#94a3b8' }}>Arquivo PDF</label>
                <div 
                  style={{
                    border: '2px dashed var(--border)',
                    borderRadius: '12px',
                    padding: '2.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: file ? 'rgba(0, 242, 255, 0.05)' : 'transparent',
                    borderColor: file ? 'var(--primary)' : 'var(--border)'
                  }} 
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <input 
                    id="file-upload"
                    type="file" 
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    style={{ display: 'none' }}
                  />
                  {file ? (
                    <div style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={32} />
                      {file.name}
                    </div>
                  ) : (
                    <div style={{ color: '#64748b' }}>
                      <Upload size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                      <p style={{ fontSize: '0.925rem' }}>Arraste o arquivo ou clique para selecionar</p>
                      <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Apenas arquivos PDF são aceitos.</p>
                    </div>
                  )}
                </div>
              </div>

              {status === 'success' && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  color: 'var(--success)', 
                  background: 'rgba(16,185,129,0.1)', 
                  padding: '1rem', 
                  borderRadius: '10px',
                  border: '1px solid rgba(16,185,129,0.2)'
                }}>
                  <CheckCircle2 size={24} />
                  <span style={{ fontWeight: 500 }}>Documento indexado com sucesso!</span>
                </div>
              )}

              {status === 'error' && (
                <div style={{ 
                  color: 'var(--danger)', 
                  fontSize: '0.875rem', 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  padding: '1rem', 
                  borderRadius: '10px',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                  <strong>Erro:</strong> {error}
                </div>
              )}

              <button 
                type="submit" 
                className="btn-primary" 
                disabled={isLoading || !file || !title}
                style={{ 
                  justifyContent: 'center', 
                  padding: '1rem',
                  marginTop: '1rem',
                  opacity: (isLoading || !file || !title) ? 0.5 : 1,
                  cursor: (isLoading || !file || !title) ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Processando PDF...</span>
                  </div>
                ) : 'Iniciar Ingestão'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
