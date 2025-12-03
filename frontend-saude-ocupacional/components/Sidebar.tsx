'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/empresas', label: 'Empresas' },
  { href: '/colaboradores', label: 'Colaboradores' },
  { href: '/exames', label: 'Exames Ocupacionais' },
  { href: '/asos', label: 'ASO' },
  { href: '/pacientes', label: 'Pacientes Clínicos' },
  { href: '/usuarios', label: 'Usuários' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col">
      <div className="px-4 py-4 text-lg font-semibold border-b border-slate-700">
        Saúde Ocupacional
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-md px-3 py-2 text-sm ${
                active
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
