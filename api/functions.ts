import axios from 'axios'

const api = axios.create({
  baseURL: process.env.angleApiBaseUrl,
  timeout: 5000,
})

export async function fetch<T = unknown>(
  url: string,
  data: any,
  config: { headers?: { [k: string]: string } } = {}
): Promise<T> {
  const {
    data: { result },
  } = await api.post<{ result: T }>(url, data, config)

  return result
}

export async function authFetch<T = unknown>(
  url: string,
  idToken?: string,
  body: any | null = null
): Promise<T> {
  if (!idToken) {
    throw new Error('Cannot fetch without user credentials')
  }

  return fetch(
    url,
    { data: body },
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  )
}
