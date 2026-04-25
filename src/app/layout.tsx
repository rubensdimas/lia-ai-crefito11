import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LIA - Inteligência Artificial CREFITO-11',
  description: 'Sistema Inteligente de Gestão de Normativas e Resoluções',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
