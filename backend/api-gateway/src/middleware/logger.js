/**
 * Registra método, rota, status e tempo de resposta de cada requisição
 * que passa pelo gateway.
 */
const requestLogger = (req, res, next) => {
  const startNs = process.hrtime.bigint();
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    const durationMs = (Number(process.hrtime.bigint() - startNs) / 1e6).toFixed(2);

    const level =
      res.statusCode >= 500 ? 'ERROR' :
      res.statusCode >= 400 ? 'WARN'  :
      'INFO';

    console.log(
      `[${timestamp}] [${level}] ${req.method} ${req.originalUrl} | status=${res.statusCode} | tempo=${durationMs}ms`
    );
  });

  next();
};

module.exports = requestLogger;
