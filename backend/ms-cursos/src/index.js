const express = require('express');
const sequelize = require('./config/database');
const cursosRouter = require('./routes/cursos');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

// Endpoint de health check — usado pelo gateway e pelo Docker para monitoramento
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ms-cursos', port: PORT });
});

app.use('/api/cursos', cursosRouter);

app.use((req, res) => {
  res.status(404).json({ status: 'error', message: `Rota '${req.originalUrl}' nao encontrada.` });
});

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexao com postgres-cursos estabelecida com sucesso.');

    // alter:true ajusta a tabela ao modelo sem apagar dados existentes
    await sequelize.sync({ alter: true });
    console.log('Tabela "cursos" sincronizada.');

    app.listen(PORT, () => {
      console.log(`\nMicrosservico de Cursos rodando na porta ${PORT}`);
      console.log(`  GET  /api/cursos`);
      console.log(`  GET  /api/cursos/:id`);
      console.log(`  POST /api/cursos\n`);
    });
  } catch (err) {
    console.error('Erro ao inicializar o microsservico de Cursos:', err.message);
    process.exit(1);
  }
};

start();
