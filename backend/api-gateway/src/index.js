const express = require('express');
const cors    = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const requestLogger = require('./middleware/logger');
const { createProxyErrorHandler } = require('./middleware/errorHandler');

const app = express();

const PORT       = process.env.PORT             || 3000;
const ALUNOS_URL = process.env.ALUNOS_SERVICE_URL || 'http://localhost:3001';
const CURSOS_URL = process.env.CURSOS_SERVICE_URL || 'http://localhost:3002';

// ── CORS: permite que o front-end (React) consuma o gateway ──────────────────
app.use(cors());

// ── Middleware global de log ──────────────────────────────────────────────────
app.use(requestLogger);

// ── Roteamento: /api/alunos -> Microsservico de Alunos (porta 3001) ──────────
// Usa pathFilter (não app.use com prefixo) para preservar o caminho completo.
// app.use('/api/alunos', proxy) faz o Express remover o prefixo do req.url,
// então o proxy enviaria GET / ao invés de GET /api/alunos para o microsservico.
app.use(
  createProxyMiddleware({
    target: ALUNOS_URL,
    changeOrigin: true,
    pathFilter: '/api/alunos',
    on: {
      error: createProxyErrorHandler('Microsservico de Alunos (porta 3001)'),
    },
  })
);

// ── Roteamento: /api/cursos -> Microsservico de Cursos (porta 3002) ──────────
app.use(
  createProxyMiddleware({
    target: CURSOS_URL,
    changeOrigin: true,
    pathFilter: '/api/cursos',
    on: {
      error: createProxyErrorHandler('Microsservico de Cursos (porta 3002)'),
    },
  })
);

// ── Rota não encontrada ───────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: `Rota '${req.originalUrl}' nao encontrada no API Gateway.`,
    rotas_disponiveis: ['/api/alunos', '/api/cursos'],
  });
});

// ── Inicializacao ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\nAPI Gateway iniciado na porta ${PORT}`);
  console.log(`  /api/alunos  ->  ${ALUNOS_URL}`);
  console.log(`  /api/cursos  ->  ${CURSOS_URL}\n`);
});
