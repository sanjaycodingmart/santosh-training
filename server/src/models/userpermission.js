'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userpermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  userpermission.init({
    permission: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'userpermission',
  });
  return userpermission;
};