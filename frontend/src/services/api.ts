/**
 * Centralized API client for communicating with the Flask backend.
 * Handles auth token management and error responses.
 */

const TOKEN_KEY = "servicepro_token";

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
        ...options,
        headers,
    });

    if (res.status === 401) {
        removeToken();
        localStorage.removeItem("servicepro_user");
        window.location.href = "/login";
        throw new Error("Sessão expirada");
    }

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Erro na requisição");
    }

    return data as T;
}

// ---- Auth ----

export interface AuthResponse {
    token: string;
    user: { id: string; nome: string; email: string };
}

export const authApi = {
    login: (email: string, senha: string) =>
        request<AuthResponse>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, senha }),
        }),

    register: (nome: string, email: string, senha: string, codigoConvite: string) =>
        request<AuthResponse>("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({ nome, email, senha, codigoConvite }),
        }),

    me: () => request<{ user: AuthResponse["user"] }>("/api/auth/me"),
};

// ---- Empresas ----

import type { Empresa, Local } from "../types";

export const empresasApi = {
    list: () => request<Empresa[]>("/api/empresas"),
    create: (data: Omit<Empresa, "id">) =>
        request<Empresa>("/api/empresas", {
            method: "POST",
            body: JSON.stringify(data),
        }),
    update: (id: string, data: Omit<Empresa, "id">) =>
        request<Empresa>(`/api/empresas/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),
    delete: (id: string) =>
        request<{ message: string }>(`/api/empresas/${id}`, { method: "DELETE" }),

    // Locais
    listLocais: (empresaId: string) =>
        request<Local[]>(`/api/empresas/${empresaId}/locais`),
    createLocal: (empresaId: string, data: Omit<Local, "id">) =>
        request<Local>(`/api/empresas/${empresaId}/locais`, {
            method: "POST",
            body: JSON.stringify(data),
        }),
    updateLocal: (empresaId: string, localId: string, data: Omit<Local, "id">) =>
        request<Local>(`/api/empresas/${empresaId}/locais/${localId}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),
    deleteLocal: (empresaId: string, localId: string) =>
        request<{ message: string }>(`/api/empresas/${empresaId}/locais/${localId}`, {
            method: "DELETE",
        }),
    allLocais: () => request<Local[]>("/api/empresas/locais/all"),
};

// ---- Serviços ----

import type { Servico } from "../types";

export const servicosApi = {
    list: (params?: { empresaId?: string; status?: string; tipo?: string }) => {
        const query = new URLSearchParams();
        if (params?.empresaId) query.set("empresaId", params.empresaId);
        if (params?.status) query.set("status", params.status);
        if (params?.tipo) query.set("tipo", params.tipo);
        const qs = query.toString();
        return request<Servico[]>(`/api/servicos${qs ? `?${qs}` : ""}`);
    },
    get: (id: string) => request<Servico>(`/api/servicos/${id}`),
    create: (data: Omit<Servico, "id">) =>
        request<Servico>("/api/servicos", {
            method: "POST",
            body: JSON.stringify(data),
        }),
    update: (id: string, data: Omit<Servico, "id">) =>
        request<Servico>(`/api/servicos/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),
    delete: (id: string) =>
        request<{ message: string }>(`/api/servicos/${id}`, { method: "DELETE" }),
};

// ---- Orçamentos ----

import type { Orcamento } from "../types";

export const orcamentosApi = {
    list: (params?: { empresaId?: string; status?: string }) => {
        const query = new URLSearchParams();
        if (params?.empresaId) query.set("empresaId", params.empresaId);
        if (params?.status) query.set("status", params.status);
        const qs = query.toString();
        return request<Orcamento[]>(`/api/orcamentos${qs ? `?${qs}` : ""}`);
    },
    get: (id: string) => request<Orcamento>(`/api/orcamentos/${id}`),
    create: (data: Omit<Orcamento, "id">) =>
        request<Orcamento>("/api/orcamentos", {
            method: "POST",
            body: JSON.stringify(data),
        }),
    update: (id: string, data: Omit<Orcamento, "id">) =>
        request<Orcamento>(`/api/orcamentos/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),
    delete: (id: string) =>
        request<{ message: string }>(`/api/orcamentos/${id}`, { method: "DELETE" }),
    updateStatus: (id: string, status: string) =>
        request<{ message: string; status: string }>(`/api/orcamentos/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
        }),
};

// ---- Financeiro ----

import type { TransacaoFinanceira } from "../types";

export interface FinanceiroStats {
    faturamentoMes: number;
    despesasMes: number;
    lucroMes: number;
    servicosConcluidosMes: number;
    servicosPendentes: number;
    orcamentosPendentes: number;
}

export interface ChartMonth {
    month: string;
    receita: number;
    despesa: number;
    lucro: number;
}

export const financeiroApi = {
    list: (params?: { tipo?: string; status?: string }) => {
        const query = new URLSearchParams();
        if (params?.tipo) query.set("tipo", params.tipo);
        if (params?.status) query.set("status", params.status);
        const qs = query.toString();
        return request<TransacaoFinanceira[]>(`/api/financeiro${qs ? `?${qs}` : ""}`);
    },
    create: (data: Omit<TransacaoFinanceira, "id">) =>
        request<TransacaoFinanceira>("/api/financeiro", {
            method: "POST",
            body: JSON.stringify(data),
        }),
    update: (id: string, data: Omit<TransacaoFinanceira, "id">) =>
        request<TransacaoFinanceira>(`/api/financeiro/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),
    delete: (id: string) =>
        request<{ message: string }>(`/api/financeiro/${id}`, { method: "DELETE" }),
    stats: (month?: string) => {
        const qs = month ? `?month=${month}` : "";
        return request<FinanceiroStats>(`/api/financeiro/stats${qs}`);
    },
    chart: (year?: string) => {
        const qs = year ? `?year=${year}` : "";
        return request<ChartMonth[]>(`/api/financeiro/chart${qs}`);
    },
};
