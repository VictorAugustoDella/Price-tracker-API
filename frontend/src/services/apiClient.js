import { logout, refreshAccessToken } from "./authService";

export async function authenticatedFetch(url, options = {}) {
  let response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (response.status !== 401) {
    return response;
  }
  try {
    await refreshAccessToken();

    response = await fetch(url, {
      ...options,
      credentials: "include",
    });

    return response;
  } catch (error) {
    await logout();
    window.location.href = "/login";
    throw error;
  }
}
