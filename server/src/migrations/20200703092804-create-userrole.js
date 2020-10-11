"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable("userrole", {
        email: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.STRING,
          references: {
            model: "usertable",
            key: "email",
          },
        },
        role: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        pendingrequest: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        status: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        doj: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: sequelize.fn('NOW'),
        },
      });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("userroles");
  },
};
