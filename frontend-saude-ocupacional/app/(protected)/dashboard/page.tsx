'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface DashboardResumo {
  cards: {
    totalEmpresas: number;
    totalColaboradores: number;
    totalExamesOcupacionais: number;
    totalAsos: number;
  };
  examesPorTipo: { tipo: string; quantidade: number }[];
  asosPorAptidao: { apto: number; inapto: number };
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [data, setData] = useState<DashboardResumo | null>(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const resp = await apiFetch<DashboardResumo>(
          '/dashboard/resumo-geral',
          {},
          token,
        );
        setData(resp);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setErro(err.message || 'Erro ao carregar dashboard');
      }
    })();
  }, [token]);

  if (erro) {
    return <div className="text-red-600 text-sm">{erro}</div>;
  }

  if (!data) {
    return <div className="text-sm text-slate-500">Carregando...</div>;
  }

  const examesTipoChart = data.examesPorTipo.map((e) => ({
    name: e.tipo,
    value: e.quantidade,
  }));

  const asosChart = [
    { name: 'Apto', value: data.asosPorAptidao.apto },
    { name: 'Inapto', value: data.asosPorAptidao.inapto },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card label="Empresas" value={data.cards.totalEmpresas} />
        <Card label="Colaboradores" value={data.cards.totalColaboradores} />
        <Card
          label="Exames Ocupacionais"
          value={data.cards.totalExamesOcupacionais}
        />
        <Card label="ASOs" value={data.cards.totalAsos} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ChartCard title="Exames por tipo">
          <PieChart width={300} height={250}>
            <Pie
              data={examesTipoChart}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              {examesTipoChart.map((_, idx) => (
                <Cell key={idx} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartCard>

        <ChartCard title="ASO - Apto x Inapto">
          <PieChart width={300} height={250}>
            <Pie
              data={asosChart}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              {asosChart.map((_, idx) => (
                <Cell key={idx} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartCard>
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="text-sm font-medium mb-2">{title}</div>
      {children}
    </div>
  );
}
