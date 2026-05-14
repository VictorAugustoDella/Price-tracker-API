import { getCookie, logout, refreshAccessToken } from "./authService";

const CSRF_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

function buildAuthenticatedOptions(options = {}) {
  const method = (options.method || "GET").toUpperCase();

  const headers = {
    ...options.headers,
  };

  if (CSRF_METHODS.includes(method)) {
    const csrfToken = getCookie("csrf_access_token");

    if (csrfToken) {
      headers["X-CSRF-TOKEN"] = csrfToken;
    }
  }

  return {
    ...options,
    headers,
    credentials: "include",
  };
}

export async function authenticatedFetch(url, options = {}) {
  let response = await fetch(url, buildAuthenticatedOptions(options));

  if (response.status !== 401) {
    return response;
  }

  try {
    await refreshAccessToken();

    response = await fetch(url, buildAuthenticatedOptions(options));

    return response;
  } catch (error) {
    try {
      await logout();
    } catch {
      // Se o logout falhar, ainda assim redireciona para o login.
    }

    window.location.href = "/login";
    throw error;
  }
}