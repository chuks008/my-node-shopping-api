module.exports = (sequelize, DataTypes) => {
  const ProductCategory = sequelize.define(
    'ProductCategory',
    {
      categoryName: DataTypes.STRING,
    },
    {
      id: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    {},
  );
  // eslint-disable-next-line func-names
  ProductCategory.associate = function(models) {
    ProductCategory.hasMany(models.Product, { as: 'products' });
  }; // has many products association
  return ProductCategory;
};
