const express = require('express');
const sequelize = require('./config/database');
const alunosRouter = require('./routes/alunos');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Endpoint de health check — usado pelo gateway e pelo Docker para monitoramento
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ms-alunos', port: PORT });
});

app.use('/api/alunos', alunosRouter);

app.use((req, res) => {
  res.status(404).json({ status: 'error', message: `Rota '${req.originalUrl}' nao encontrada.` });
});

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexao com postgres-alunos estabelecida com sucesso.');

    // alter:true ajusta a tabela ao modelo sem apagar dados existentes
    await sequelize.sync({ alter: true });
    console.log('Tabela "alunos" sincronizada.');

    app.listen(PORT, () => {
      console.log(`\nMicrosservico de Alunos rodando na porta ${PORT}`);
      console.log(`  GET  /api/alunos`);
      console.log(`  GET  /api/alunos/:id`);
      console.log(`  POST /api/alunos\n`);
    });
  } catch (err) {
    console.error('Erro ao inicializar o microsservico de Alunos:', err.message);
    process.exit(1);
  }
};

start();
