
import { apiRequest, ACCESS_TOKEN_KEY } from "./api";

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  role: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

const USER_STORAGE_KEY = "debugarena_user";

// Store authenticated user information.
export function saveAuthUser(user: AuthUser): void {
  sessionStorage.setItem(
    USER_STORAGE_KEY,
    JSON.stringify(user)
  );
}

// Retrieve stored user information.
export function getAuthUser(): AuthUser | null {
  const stored = sessionStorage.getItem(USER_STORAGE_KEY);

  if (!stored) return null;

  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
}

// Clear the local authentication session.
export function clearAuthUser(): void {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(USER_STORAGE_KEY);
}

// Authenticate using the real backend.
export async function login(
  email: string,
  password: string
): Promise<AuthUser> {
  clearAuthUser();

  const response = await apiRequest<LoginResponse>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }
  );

  // Store the token before making protected requests.
  sessionStorage.setItem(
    ACCESS_TOKEN_KEY,
    response.access_token
  );

  saveAuthUser(response.user);

  // This frontend is currently the recruiter portal.
  if (response.user.role !== "recruiter") {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } finally {
      clearAuthUser();
    }

    throw new Error(
      "This account does not have recruiter access."
    );
  }

  return response.user;
}

// Verify the current session with the backend.
export async function getCurrentUser(): Promise<AuthUser> {
  const user = await apiRequest<AuthUser>("/auth/me");

  if (user.role !== "recruiter") {
    throw new Error("Recruiter access required.");
  }

  saveAuthUser(user);
  return user;
}

// Revoke the backend session and clear local state.
export async function logout(): Promise<void> {
  try {
    await apiRequest("/auth/logout", {
      method: "POST",
    });
  } finally {
    clearAuthUser();
  }
}
