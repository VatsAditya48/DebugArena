
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("debugarena_access_token");
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error?.message || data?.detail || "Request failed");
  }
  return data as T;
}

export interface Assessment {
  id: string;
  title: string;
  description: string | null;
  language: string;
  difficulty: "easy" | "medium" | "hard";
  duration_minutes: number;
  question_count: number;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export interface AssessmentCreate {
  title: string;
  language: string;
  difficulty: "easy" | "medium" | "hard";
  duration_minutes: number;
  question_count: number;
}
