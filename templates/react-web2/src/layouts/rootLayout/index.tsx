import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const menu = [
  { label: '学习列表', to: '/list' },
  { label: '新功能', to: '/newFeature' },
];

const RootLayout = () => {
  const { pathname } = useLocation();

  return (
    <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
      <aside className="rounded-xl bg-slate-950/70 p-3 ring-1 ring-white/5 shadow-md shadow-slate-900/40">
        <nav className="flex flex-col gap-2">
          {menu.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active ? 'bg-white/10 text-white ring-1 ring-white/10' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <section className="rounded-xl bg-slate-900/60 p-6 ring-1 ring-white/5 shadow-lg shadow-slate-900/30">
        <Outlet />
      </section>
    </div>
  );
};

export default RootLayout;
