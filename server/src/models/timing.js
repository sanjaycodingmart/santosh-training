'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class timing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  timing.init({
    operation: DataTypes.STRING,
    value: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'timing',
  });
  return timing;
};