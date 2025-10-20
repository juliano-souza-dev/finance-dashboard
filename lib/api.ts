export class FetchError extends Error {
  status: number;
  body?: any;
  constructor(message: string, status: number, body?: any) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    let errorDetail = 'Erro desconhecido';
    let body: any;
    try {
      body = await response.json();
      errorDetail = body.message || JSON.stringify(body);
    } catch {
      errorDetail = `Erro HTTP: ${response.status} ${response.statusText}`;
    }
    throw new FetchError(errorDetail, response.status, body);
  }

  try {
    const text = await response.text();
    return text ? (JSON.parse(text) as T) : ({} as T);
  } catch (e) {
    throw new Error('Erro ao analisar resposta JSON');
  }
}
