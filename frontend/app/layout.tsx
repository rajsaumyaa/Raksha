import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Raksha - AI Digital Public Safety Platform',
  description: 'Real-time AI detection of digital arrest and government impersonation scams, clustering isolated citizen complaints into actionable fraud network graphs for law enforcement.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col selection:bg-red-500 selection:text-white">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Raksha Platform • Built for ET AI Hackathon 2026 • Problem Statement 6</span>
            <span className="font-mono text-slate-400">Groq LLM Llama-3.3-70b Engine</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
