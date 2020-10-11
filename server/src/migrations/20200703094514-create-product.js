'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("product", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: "usertable",
          key: "email",
        },
      },
      product_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      product_image: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      product_prize: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      product_category: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      product_companyname: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      product_warranty: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      product_assured: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      product_description: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('product');
  }
};