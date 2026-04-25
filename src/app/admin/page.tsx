import { FileText, MessageSquare, ShieldCheck, TrendingUp } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * Página Principal do Dashboard Admin
 * Apresenta métricas rápidas e atividade recente
 */
export default async function AdminPage() {
  // 1. Buscar métricas reais
  const { count: docCount } = await supabaseAdmin
    .from('documents')
    .select('*', { count: 'exact', head: true });

  const { count: interactionCount } = await supabaseAdmin
    .from('lia_audit_logs')
    .select('*', { count: 'exact', head: true });

  // Buscar logs recentes
  const { data: recentLogs } = await supabaseAdmin
    .from('lia_audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: recentDocs } = await supabaseAdmin
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(2);

  // Unificar atividades para a lista
  const activities = [
    ...(recentDocs?.map(d => ({ 
      title: 'Novo Documento', 
      desc: d.title, 
      time: new Date(d.created_at),
      type: 'doc' 
    })) || []),
    ...(recentLogs?.map(l => ({ 
      title: 'Consulta RAG', 
      desc: l.prompt.substring(0, 50) + (l.prompt.length > 50 ? '...' : ''), 
      time: new Date(l.created_at),
      type: 'chat'
    })) || [])
  ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 5);

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Agora mesmo';
    if (diffInHours < 24) return `Há ${diffInHours} horas`;
    return date.toLocaleDateString('pt-BR');
  };
  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Painel de Controle</h1>
        <p style={{ color: '#94a3b8' }}>Bem-vindo à central de inteligência da LIA.</p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '3rem' 
      }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(0, 242, 255, 0.1)', color: 'var(--primary)', borderRadius: '8px' }}>
              <FileText size={24} />
            </div>
            <span style={{ color: 'var(--success)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <TrendingUp size={14} /> +12%
            </span>
          </div>
          <h3 style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Total de Documentos</h3>
          <p style={{ fontSize: '1.875rem', fontWeight: 700 }}>{docCount || 0}</p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent)', borderRadius: '8px' }}>
              <MessageSquare size={24} />
            </div>
            <span style={{ color: 'var(--success)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <TrendingUp size={14} /> +100%
            </span>
          </div>
          <h3 style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Total de Interações</h3>
          <p style={{ fontSize: '1.875rem', fontWeight: 700 }}>{interactionCount || 0}</p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '8px' }}>
              <ShieldCheck size={24} />
            </div>
          </div>
          <h3 style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Status do Motor RAG</h3>
          <p style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--success)' }}>Ativo</p>
        </div>
      </div>

      <section className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Atividade Recente</h2>
          <button style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 500 }}>Ver tudo</button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {activities.length > 0 ? activities.map((item, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              paddingBottom: '1.25rem', 
              borderBottom: i === activities.length - 1 ? 'none' : '1px solid var(--border)' 
            }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ 
                  width: '10px', 
                  height: '10px', 
                  background: item.type === 'doc' ? 'var(--primary)' : 'var(--accent)', 
                  borderRadius: '50%',
                  boxShadow: item.type === 'doc' ? '0 0 10px var(--primary-glow)' : 'none'
                }}></div>
                <div>
                  <p style={{ fontWeight: 500, fontSize: '1rem' }}>{item.title}</p>
                  <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{item.desc}</p>
                </div>
              </div>
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{formatRelativeTime(item.time)}</span>
            </div>
          )) : (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Sem atividade recente.</p>
          )}
        </div>
      </section>
    </div>
  );
}
