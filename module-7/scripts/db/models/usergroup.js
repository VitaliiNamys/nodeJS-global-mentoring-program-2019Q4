const uuid = require('uuid');

'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserGroup = sequelize.define('UserGroup', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: () => uuid(),
    },
    groupId: DataTypes.STRING,
    userId: DataTypes.STRING
  }, {});
  UserGroup.associate = function(models) {
    UserGroup.hasMany(models.User);
    UserGroup.hasMany(models.Group);
  };
  return UserGroup;
};
