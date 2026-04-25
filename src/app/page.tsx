import { redirect } from 'next/navigation';

/**
 * Página Raiz (/)
 * Redireciona automaticamente para o Dashboard Administrativo.
 */
export default function HomePage() {
  redirect('/admin');
}
