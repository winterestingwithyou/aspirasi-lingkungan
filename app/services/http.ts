type Query = Record<
  string,
  string | number | boolean | null | undefined | unknown
>;
type HeadersInitish = HeadersInit | Record<string, string | undefined>;

function buildURL(base: string, path: string, params?: Query) {
  const url = new URL(path, base);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

async function parseJson<T>(res: Response): Promise<T> {
  const ct = res.headers.get('content-type');
  if (ct && ct.includes('application/json')) {
    return (await res.json()) as T;
  }
  // fallback: teks → lempar sebagai error biar gampang debug
  const text = await res.text();
  throw new Error(`Unexpected response (${res.status}): ${text}`);
}

/**
 * HTTP client berbasis Fetch yang isomorphic (SSR/CSR).
 * Di Workers/SSR, pakai global fetch; di browser juga sama.
 */
function createHttp(request?: Request) {
  const origin = request ? new URL(request.url).origin : '';

  async function get<T>(
    path: string,
    opts?: { params?: Query; headers?: HeadersInitish },
  ) {
    const url = buildURL(origin, path, opts?.params);
    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json', ...(opts?.headers ?? {}) },
    });
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return await parseJson<T>(res);
  }

  async function post<T, B = unknown>(
    path: string,
    body?: B,
    opts?: { headers?: HeadersInitish },
  ) {
    const url = buildURL(origin, path);
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(opts?.headers ?? {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
    return await parseJson<T>(res);
  }

  async function del<T>(path: string, opts?: { headers?: HeadersInitish }) {
    const url = buildURL(origin, path);
    const res = await fetch(url, {
      method: 'DELETE',
      headers: { Accept: 'application/json', ...(opts?.headers ?? {}) },
    });
    if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
    return await parseJson<T>(res);
  }

  return { get, post, del };
}

export { type Query, type HeadersInitish, createHttp };
