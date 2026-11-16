import { apiRequest } from "./api";

export async function checkBackendHealth() {
  return apiRequest<unknown>("/health", {
    method: "GET",
  });
}