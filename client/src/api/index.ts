export type ApiResponse<T = undefined> =
  | {
      data: T
      ok: true
    }
  | {
      error: string
      ok: false
    }

export const handleResponse = async <T>(
  response: Response,
): Promise<ApiResponse<T>> => {
  if (!response.ok) return { error: response.statusText, ok: false }
  if (response.status === 204) return { ok: true, data: undefined as T }
  return { data: await response.json(), ok: true }
}
