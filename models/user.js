'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('users', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    username: {
      type:DataTypes.STRING,
      unique:true
    },
    password: {
      type:DataTypes.STRING,
      allowNull:false
    },
    firstname: {
      type:DataTypes.STRING,
      allowNull:false
    },
    lastname: {
      type:DataTypes.STRING,
      allowNull:false
    }
  }, {});
  user.associate = function(models) {
    user.hasMany(models.reviews, {
      foreignKey: 'username',
      sourceKey:'username',
      onDelete: 'CASCADE'
    });
  };
  return user;
};