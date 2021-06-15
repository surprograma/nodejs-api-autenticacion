'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Usuarios', 'contraseniaEncriptada', {
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropColumn('Usuarios', 'contraseniaEncriptada');
  },
};
