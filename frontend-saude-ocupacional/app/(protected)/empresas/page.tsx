/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';

interface Empresa {
  id: number;
  razaoSocial: string;
  nomeFantasia?: string | null;
  cnpj: string;
  cnae?: string | null;
  grauRisco?: string | null;
  ativo: boolean;
}

export default function EmpresasPage() {
  const { token } = useAuth();
  const [lista, setLista] = useState<Empresa[]>([]);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    cnae: '',
    grauRisco: '',
  });

  async function carregar() {
    if (!token) return;
    setErro('');
    try {
      const data = await apiFetch<Empresa[]>('/empresa', {}, token);
      setLista(data);
    } catch (err: any) {
      setErro(err.message || 'Erro ao listar empresas');
    }
  }

  useEffect(() => {
    void carregar();
  }, [token]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    setErro('');

    try {
      await apiFetch<Empresa>(
        '/empresa',
        {
          method: 'POST',
          body: JSON.stringify(form),
        },
        token,
      );
      setForm({
        razaoSocial: '',
        nomeFantasia: '',
        cnpj: '',
        cnae: '',
        grauRisco: '',
      });
      await carregar();
    } catch (err: any) {
      setErro(err.message || 'Erro ao salvar empresa');
    } finally {
      setLoading(false);
    }
  }

  async function toggleAtivo(emp: Empresa) {
    if (!token) return;
    try {
      await apiFetch<Empresa>(
        `/empresa/${emp.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ ativo: !emp.ativo }),
        },
        token,
      );
      await carregar();
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar');
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">Empresas</h1>

      {erro && <div className="text-sm text-red-600">{erro}</div>}

      <section className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-sm font-medium mb-3">Nova empresa</h2>
        <form
          className="grid md:grid-cols-3 gap-3 text-sm"
          onSubmit={handleSubmit}
        >
          <input
            className="border rounded-md px-2 py-1"
            placeholder="Razão Social"
            value={form.razaoSocial}
            onChange={(e) =>
              setForm((f) => ({ ...f, razaoSocial: e.target.value }))
            }
            required
          />
          <input
            className="border rounded-md px-2 py-1"
            placeholder="Nome Fantasia"
            value={form.nomeFantasia}
            onChange={(e) =>
              setForm((f) => ({ ...f, nomeFantasia: e.target.value }))
            }
          />
          <input
            className="border rounded-md px-2 py-1"
            placeholder="CNPJ"
            value={form.cnpj}
            onChange={(e) => setForm((f) => ({ ...f, cnpj: e.target.value }))}
            required
          />
          <input
            className="border rounded-md px-2 py-1"
            placeholder="CNAE"
            value={form.cnae}
            onChange={(e) => setForm((f) => ({ ...f, cnae: e.target.value }))}
          />
          <input
            className="border rounded-md px-2 py-1"
            placeholder="Grau de risco"
            value={form.grauRisco}
            onChange={(e) =>
              setForm((f) => ({ ...f, grauRisco: e.target.value }))
            }
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-sky-600 text-white rounded-md px-3 py-2 text-sm font-medium hover:bg-sky-700 disabled:opacity-60"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
      </section>

      <section className="bg-white rounded-lg shadow-sm p-4 text-sm">
        <h2 className="font-medium mb-3">Lista de empresas</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="border px-2 py-1 text-left">ID</th>
                <th className="border px-2 py-1 text-left">Razão Social</th>
                <th className="border px-2 py-1 text-left">CNPJ</th>
                <th className="border px-2 py-1 text-left">Ativo</th>
                <th className="border px-2 py-1 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((emp) => (
                <tr key={emp.id}>
                  <td className="border px-2 py-1">{emp.id}</td>
                  <td className="border px-2 py-1">{emp.razaoSocial}</td>
                  <td className="border px-2 py-1">{emp.cnpj}</td>
                  <td className="border px-2 py-1">
                    {emp.ativo ? 'Ativa' : 'Inativa'}
                  </td>
                  <td className="border px-2 py-1">
                    <button
                      onClick={() => toggleAtivo(emp)}
                      className="text-xs px-2 py-1 rounded-md border hover:bg-slate-100"
                    >
                      {emp.ativo ? 'Desativar' : 'Ativar'}
                    </button>
                  </td>
                </tr>
              ))}

              {lista.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="border px-2 py-3 text-center text-slate-400"
                  >
                    Nenhuma empresa cadastrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
