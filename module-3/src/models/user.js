'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    _id: DataTypes.STRING,
    login: DataTypes.STRING,
    password: DataTypes.STRING,
    age: DataTypes.NUMBER,
    isDeleted: DataTypes.BOOLEAN
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};