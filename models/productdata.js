'use strict';
module.exports = (sequelize, DataTypes) => {
  const productData = sequelize.define('productData', {
    username: DataTypes.STRING,
    products: DataTypes.TEXT
  }, {});
  productData.associate = function(models) {
    // associations can be defined here
  };
  return productData;
};