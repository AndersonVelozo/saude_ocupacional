/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

type UserRole = 'ADMIN' | 'RH' | 'MEDICO' | 'CLINICA' | 'COLABORADOR';

interface User {
  id: number;
  nome: string;
  email: string;
  role: UserRole;
}

interface AuthContextValue {
  token: string | null;
  user: User | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  async function login(email: string, senha: string) {
    const data = await apiFetch<{
      token: string;
      nome: string;
      role: UserRole;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });

    const newUser: User = {
      id: 0, // se quiser, depois cria rota /me no backend
      nome: data.nome,
      email,
      role: data.role,
    };

    setToken(data.token);
    setUser(newUser);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(newUser));

    router.push('/dashboard');
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
