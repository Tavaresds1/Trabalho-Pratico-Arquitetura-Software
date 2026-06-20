import axios from 'axios';

/**
 * Instância Axios apontando EXCLUSIVAMENTE para o API Gateway.
 * Nenhum componente ou serviço deve importar outra baseURL.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Resposta recebida com status de erro (4xx / 5xx)
    if (error.response) {
      const { status, data } = error.response;

      const message =
        status === 503
          ? data.detail || data.message || 'Servico indisponivel.'
          : status === 404
          ? data.message || 'Recurso nao encontrado.'
          : status === 409
          ? data.message || 'Registro duplicado.'
          : status === 422
          ? data.message || 'Dados invalidos.'
          : data.message || `Erro inesperado no servidor (${status}).`;

      return Promise.reject({ status, message, errors: data.errors });
    }

    // Nenhuma resposta recebida — gateway inacessivel
    if (error.request) {
      return Promise.reject({
        status: 0,
        message:
          'Nao foi possivel conectar ao API Gateway. Verifique se o servidor esta em execucao na porta 3000.',
      });
    }

    return Promise.reject({ status: -1, message: error.message });
  }
);

export default api;
