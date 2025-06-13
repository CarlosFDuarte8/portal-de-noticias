import axios from "axios";
const api = axios.create({
  baseURL: "https://newsapi.org/v2",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      console.error("Erro na resposta:", error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      console.error("Erro na requisição:", error.request);
      return Promise.reject("Erro de rede: sem resposta do servidor");
    } else {
      console.error("Erro ao configurar a requisição:", error.message);
      return Promise.reject(error.message);
    }
  }
);
export default api;
