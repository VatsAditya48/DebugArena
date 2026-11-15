
export interface AuthUser {
  email: string;
  role: "recruiter";
}

const AUTH_STORAGE_KEY = "debugarena_user";

// Get the currently stored user
export function getAuthUser(): AuthUser | null {
  const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    const user = JSON.parse(storedUser);

    if (
      typeof user.email !== "string" ||
      user.role !== "recruiter"
    ) {
      return null;
    }

    return user as AuthUser;
  } catch {
    return null;
  }
}

// Save user information
export function saveAuthUser(user: AuthUser): void {
  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify(user)
  );
}

// Clear user information during logout
export function clearAuthUser(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}