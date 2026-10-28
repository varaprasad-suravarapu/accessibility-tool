import api from "./api"

export interface URLValidationResponse {
  status: "success"
  message: string
  url: string
}

export interface URLValidationError {
  status: "error"
  message: string
}

export async function validateURL(
  url: string,
): Promise<URLValidationResponse> {
  const response = await api.post<URLValidationResponse>(
    "validate-url/",
    { url },
  )

  return response.data
}