module.exports = (sequelize, DataTypes) => {
  const ProductCategory = sequelize.define(
    'ProductCategories',
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
  // ProductCategory.associate = function(models) {
  //   // associations can be defined here
  // }; // has many products association
  return ProductCategory;
};
