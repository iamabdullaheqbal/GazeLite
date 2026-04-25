import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'GazeLite — Attention Heatmap Dashboard',
  description: 'Real-time gaze and attention heatmap analytics dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <main style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>{children}</main>
        </div>
      </body>
    </html>
  );
}
