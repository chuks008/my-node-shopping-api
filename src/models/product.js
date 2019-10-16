module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      name: DataTypes.STRING,
      categoryId: DataTypes.INTEGER,
    },
    {},
  );
  Product.associate = models => {
    // associations can be defined here

    Product.belongsTo(models.ProductCategory, {
      foreignKey: 'categoryId',
      as: 'product_category',
    });
  };
  return Product;
};
