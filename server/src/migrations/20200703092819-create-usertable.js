'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable("usertable", {
        name: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        email: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.STRING,
        },
        password: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        forgot_password: {
          allowNull: true,
          type: Sequelize.STRING,
        },
      });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('usertable');
  }
};