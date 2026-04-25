/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Permite que o Next.js lide com o Supabase e outras libs ESM
  transpilePackages: ['@langchain/openai', '@langchain/core', 'langchain'],
  // Impede que o Turbopack faça bundle destas libs no servidor,
  // permitindo que o Node.js as resolva nativamente (corrige o erro do pdfjs-dist worker)
  serverExternalPackages: ['pdf-parse', 'pdfjs-dist'],
};

export default nextConfig;
