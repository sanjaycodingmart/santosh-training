'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userrole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  userrole.init({
    email: DataTypes.STRING,
    role: DataTypes.STRING,
    pendingrequest: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'userrole',
  });
  return userrole;
};