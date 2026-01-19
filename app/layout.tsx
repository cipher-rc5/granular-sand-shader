// file: app/layout.tsx
// description: Root layout component for Next.js application
// reference: Next.js App Router layout structure

import { type Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Granular Sand Shader',
  description: 'High-definition micro-sands texture simulation using WebGL shaders'
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): React.JSX.Element {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className='antialiased'>{children}</body>
    </html>
  );
}
