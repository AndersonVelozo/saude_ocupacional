'use client';

import { useAuth } from '@/context/AuthContext';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-4">
      <div className="font-medium text-sm">Painel</div>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-slate-500">
          {user?.nome} • <span className="uppercase">{user?.role}</span>
        </span>
        <button
          onClick={logout}
          className="text-xs px-3 py-1 rounded-md border border-slate-300 hover:bg-slate-100"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
