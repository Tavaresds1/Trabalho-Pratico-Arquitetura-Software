const { Router } = require('express');
const { Op } = require('sequelize');
const Aluno = require('../models/Aluno');

const router = Router();

// GET /api/alunos — lista todos, com busca opcional por nome
router.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.query.nome) {
      where.nome = { [Op.iLike]: `%${req.query.nome}%` };
    }

    const alunos = await Aluno.findAll({ where, order: [['nome', 'ASC']] });
    res.json({ data: alunos, total: alunos.length });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/alunos/:id — busca por PK
router.get('/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findByPk(req.params.id);
    if (!aluno) {
      return res.status(404).json({ status: 'error', message: 'Aluno nao encontrado.' });
    }
    res.json({ data: aluno });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/alunos — cadastra novo aluno
router.post('/', async (req, res) => {
  try {
    const { nome, matricula, email } = req.body;
    const aluno = await Aluno.create({ nome, matricula, email });
    res.status(201).json({ status: 'created', data: aluno });
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return res.status(422).json({
        status: 'error',
        message: 'Dados invalidos.',
        errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
      });
    }
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        status: 'error',
        message: 'Matricula ou e-mail ja cadastrado.',
        errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
      });
    }
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
