'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  product.init({
    id: DataTypes.INTEGER,
    email: DataTypes.STRING,
    product_name: DataTypes.STRING,
    product_image: DataTypes.STRING,
    product_prize: DataTypes.INTEGER,
    product_category: DataTypes.STRING,
    product_companyname: DataTypes.STRING,
    product_warranty: DataTypes.STRING,
    product_assured: DataTypes.STRING,
    product_description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'product',
  });
  return product;
};