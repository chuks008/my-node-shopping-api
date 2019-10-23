module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
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
