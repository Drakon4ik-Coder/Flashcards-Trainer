export async function api(path, options = {}) {
  const res = await fetch(path, {
    credentials: "include", // send cookies for auth
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // ignore JSON parse errors (e.g. empty body)
  }

  if (!res.ok) {
    throw new Error(data?.error || `HTTP ${res.status}`);
  }

  return data;
}