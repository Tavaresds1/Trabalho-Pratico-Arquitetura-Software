const { Router } = require('express');
const { Op } = require('sequelize');
const Curso = require('../models/Curso');

const router = Router();

// GET /api/cursos — lista todos, com filtros opcionais por departamento ou nome
router.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.query.nome) {
      where.nome = { [Op.iLike]: `%${req.query.nome}%` };
    }
    if (req.query.departamento) {
      where.departamento = { [Op.iLike]: `%${req.query.departamento}%` };
    }

    const cursos = await Curso.findAll({ where, order: [['nome', 'ASC']] });
    res.json({ data: cursos, total: cursos.length });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/cursos/:id — busca por PK
router.get('/:id', async (req, res) => {
  try {
    const curso = await Curso.findByPk(req.params.id);
    if (!curso) {
      return res.status(404).json({ status: 'error', message: 'Curso nao encontrado.' });
    }
    res.json({ data: curso });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/cursos — cadastra novo curso
router.post('/', async (req, res) => {
  try {
    const { nome, carga_horaria, departamento } = req.body;
    const curso = await Curso.create({ nome, carga_horaria, departamento });
    res.status(201).json({ status: 'created', data: curso });
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return res.status(422).json({
        status: 'error',
        message: 'Dados invalidos.',
        errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
      });
    }
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
