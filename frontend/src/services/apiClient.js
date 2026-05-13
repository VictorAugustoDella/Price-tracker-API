import { refreshAccessToken } from "./authService";

export async function authenticatedFetch(url, options = {}) {
  const access_token = localStorage.getItem("token");
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${access_token}`,
  };

  let response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status !== 401) {
    return response;
  }

  const newAccessToken = await refreshAccessToken();

  const refreshedHeaders = {
    ...options.headers,
    Authorization: `Bearer ${newAccessToken}`,
  };

  response = await fetch(url, {
    ...options,
    headers: refreshedHeaders,
  });

  return response;
}
