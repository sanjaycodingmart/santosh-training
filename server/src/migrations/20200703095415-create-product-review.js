'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("product_review", {
      product_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "product",
          key: "id",
        },
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      user_comment: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      user_rating: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('product_review');
  }
};