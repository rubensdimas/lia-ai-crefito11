import Link from 'next/link';
import { LayoutDashboard, FileText, History, Settings, LogOut } from 'lucide-react';

/**
 * Layout de Administração da LIA
 * Contém a barra lateral de navegação e container principal
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="logo-icon"></div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            LIA <span style={{ color: 'var(--primary)', fontSize: '0.875rem', verticalAlign: 'middle' }}>Admin</span>
          </h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <Link href="/admin" className="nav-item active">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/admin/documents" className="nav-item">
            <FileText size={20} />
            Documentos
          </Link>
          <Link href="/admin/logs" className="nav-item">
            <History size={20} />
            Logs de Auditoria
          </Link>
        </nav>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/admin/settings" className="nav-item">
            <Settings size={20} />
            Configurações
          </Link>
          <button className="nav-item" style={{ color: 'var(--danger)', width: '100%', textAlign: 'left' }}>
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
