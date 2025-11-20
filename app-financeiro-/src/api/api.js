import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

// ---- Transações ----
export const getTransacoes = (userId) =>
  api.get(`/transacoes?userId=${userId}`);

export const getTotais = (userId) =>
  api.get(`/transacoes/totais?userId=${userId}`);

// ---- Dashboard ----
export const getDashboard = (userId) =>
  api.get(`/dashboard?userId=${userId}`);

export default api;