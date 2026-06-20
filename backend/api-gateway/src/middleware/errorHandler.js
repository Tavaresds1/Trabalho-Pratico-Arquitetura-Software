/**
 * Retorna uma factory que gera o handler de erro de proxy para um serviço
 * específico. Responde com 503 quando o microsserviço interno está inacessível.
 *
 * @param {string} serviceName - Nome legível do serviço para exibição no log e na resposta.
 */
const createProxyErrorHandler = (serviceName) => (err, req, res) => {
  const timestamp = new Date().toISOString();

  console.error(
    `[${timestamp}] [PROXY_ERROR] Falha ao conectar com ${serviceName}: ${err.message}`
  );

  if (res.headersSent) return;

  res.status(503).json({
    status: 'error',
    code: 503,
    message: 'Servico temporariamente indisponivel.',
    detail: `${serviceName} nao esta respondendo. Verifique se o servico esta em execucao e tente novamente.`,
    timestamp,
  });
};

module.exports = { createProxyErrorHandler };
