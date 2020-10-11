'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product_review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  product_review.init({
    product_id: DataTypes.NUMBER,
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    user_comment: DataTypes.STRING,
    user_rating: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'product_review',
  });
  return product_review;
};