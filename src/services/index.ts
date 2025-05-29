//  um serviço axios para fazer requisições HTTP pegando o API_KEY e // BASE_URL do arquivo .env
import axios from 'axios';
const api = axios.create({
  baseURL: 'https://newsapi.org/v2',
  headers: {
    'Content-Type': 'application/json',
  },
});
// Interceptores para tratar erros e respostas
api.interceptors.response.use(
  response => {
    // Se a resposta for bem-sucedida, apenas retorna os dados
    return response.data;
  }
,
  error => {        
    // Se ocorrer um erro, verifica se é um erro de rede ou de resposta
    if (error.response) {
      // O servidor respondeu com um status diferente de 2xx
      console.error('Erro na resposta:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // A requisição foi feita, mas não houve resposta
      console.error('Erro na requisição:', error.request);
      return Promise.reject('Erro de rede: sem resposta do servidor');
    } else {
      // Algo aconteceu ao configurar a requisição
      console.error('Erro ao configurar a requisição:', error.message);
      return Promise.reject(error.message);
    }
  }
);
export default api;