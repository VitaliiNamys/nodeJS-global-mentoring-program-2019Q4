'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: DataTypes.UUID,
    login: DataTypes.STRING,
    password: DataTypes.STRING,
    age: DataTypes.INTEGER,
    isDeleted: DataTypes.BOOLEAN
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};