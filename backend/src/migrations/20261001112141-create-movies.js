'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('filmes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      titulo: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      genero: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      ano_lancamento: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      nota: {
        type: Sequelize.DECIMAL(3, 1),
        allowNull: false,
      },
      disponibilidade_plataforma: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('filmes');
  },
};