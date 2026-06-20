const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Curso = sequelize.define(
  'Curso',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'O campo nome nao pode ser vazio.' },
        len: { args: [2, 100], msg: 'O nome deve ter entre 2 e 100 caracteres.' },
      },
    },
    carga_horaria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt:  { msg: 'A carga horaria deve ser um numero inteiro.' },
        min:    { args: [1],    msg: 'A carga horaria deve ser maior que zero.' },
        max:    { args: [9999], msg: 'A carga horaria nao pode exceder 9999 horas.' },
      },
    },
    departamento: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'O campo departamento nao pode ser vazio.' },
      },
    },
  },
  {
    tableName: 'cursos',
    timestamps: true,
  }
);

module.exports = Curso;
