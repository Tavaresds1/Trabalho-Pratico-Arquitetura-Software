const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Aluno = sequelize.define(
  'Aluno',
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
    matricula: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'O campo matricula nao pode ser vazio.' },
      },
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Formato de e-mail invalido.' },
      },
    },
  },
  {
    tableName: 'alunos',
    timestamps: true,
  }
);

module.exports = Aluno;
