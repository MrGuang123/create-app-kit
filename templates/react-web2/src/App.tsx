import React from 'react';
import AppRoutes from '@/routes';

const App = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950" />
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-96 w-96 -translate-x-1/2 bg-cyan-500/20 blur-[120px]" />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <AppRoutes />
      </main>
    </div>
  );
};

export default App;
