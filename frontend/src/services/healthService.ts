import api from "./api";

export interface HealthResponse {
  status: string;
  message: string;
}

export const checkApiHealth = async (): Promise<HealthResponse> => {
  const response = await api.get<HealthResponse>("health/");
  return response.data;
};