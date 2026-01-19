// file: app/page.tsx
// description: Main page component with granular sand shader and UI overlay
// reference: Next.js page component with client-side rendering

'use client';
import { DesertSand } from '@/components/desert-sand';

export default function Home(): React.JSX.Element {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-sand-light'>
      <div className='fixed inset-0 z-0'>
        <DesertSand />
      </div>

      <div className='relative z-10 w-full max-w-4xl px-8 flex flex-col items-center'>
        <div className='space-y-4 text-center'>
          <h1 className='text-6xl md:text-8xl font-thin tracking-tight text-sand-text/80 drop-shadow-sm'>Granular</h1>
          <p className='text-sand-subtle/60 tracking-[0.6em] uppercase text-xs font-light'>High-definition micro-sands</p>
        </div>

        <div className='mt-16'>
          <button className='px-10 py-4 bg-white/20 backdrop-blur-xl border border-white/30 text-sand-text text-[10px] uppercase tracking-[0.3em] rounded-full hover:bg-white/40 transition-all duration-500 shadow-xl shadow-black/5'>
            Initialize Sequence
          </button>
        </div>
      </div>

      <div className='fixed bottom-12 w-full px-12 flex justify-between items-end z-10 pointer-events-none'>
        <div className='flex flex-col gap-1 opacity-30'>
          <span className='text-[10px] font-mono tracking-tighter'>GRN_SIZE: 0.004mm</span>
          <span className='text-[10px] font-mono tracking-tighter'>DENSITY: HIGH</span>
        </div>
        <div className='text-[9px] uppercase tracking-[0.5em] text-sand-text opacity-30'>Tactile Texture Simulation</div>
      </div>
    </div>
  );
}
