import { refreshAccessToken } from "./authService";

export async function authenticatedFetch(url, options = {}) {

  let response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (response.status !== 401) {
    return response;
  }
  
  await refreshAccessToken();

  response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  return response;
}
