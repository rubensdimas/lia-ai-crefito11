import { supabaseAdmin } from '@/lib/supabase/admin';
import UploadButton from './UploadButton';
import { FileText, MoreVertical, Calendar } from 'lucide-react';

/**
 * Página de Gestão de Documentos
 * Lista os documentos indexados e permite novos uploads
 */
export default async function DocumentsPage() {
  // Busca os documentos usando o cliente admin
  const { data: documents, error } = await supabaseAdmin
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar documentos:', error);
  }

  return (
    <div className="animate-fade-in">
      <header style={{ 
        marginBottom: '2.5rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end' 
      }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Documentos</h1>
          <p style={{ color: '#94a3b8' }}>Gerencie a base de conhecimento da LIA.</p>
        </div>
        <UploadButton />
      </header>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ 
              borderBottom: '1px solid var(--border)', 
              color: '#94a3b8', 
              fontSize: '0.875rem',
              background: 'rgba(255,255,255,0.02)'
            }}>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500 }}>Título do Documento</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500 }}>Data de Ingestão</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500, textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {documents && documents.length > 0 ? (
              documents.map((doc) => (
                <tr key={doc.id} style={{ 
                  borderBottom: '1px solid var(--border)', 
                  transition: 'background 0.2s',
                }}>
                  <td style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ 
                        color: 'var(--primary)', 
                        background: 'rgba(0, 242, 255, 0.05)',
                        padding: '0.5rem',
                        borderRadius: '8px'
                      }}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 500, fontSize: '1rem' }}>{doc.title}</p>
                        <p style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>
                          {doc.source_url}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.5rem' }}>
                    <span className={`status-badge ${doc.status.toLowerCase()}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td style={{ padding: '1.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={14} />
                      {new Date(doc.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </td>
                  <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                    <button style={{ color: '#64748b', padding: '0.5rem', borderRadius: '4px' }}>
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ padding: '6rem', textAlign: 'center', color: '#64748b' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <FileText size={48} style={{ opacity: 0.2 }} />
                    <p>Nenhum documento encontrado na base de conhecimento.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
