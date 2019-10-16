/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
// const { ProductCategory } = require('../../models').models;

/**
 * Product Category service
 * @module category/service
 */
module.exports = ProductCategory => {
  return {
    /**
     * Update a product category with a new category name
     *
     * @param {*} id - id of the product category to update
     * @param {*} categoryName - old product category name
     * @param {*} newCategoryName - new product category name
     */
    updateCategory: async (id, categoryName, newCategoryName) => {
      try {
        const updatedCategory = await ProductCategory.update(
          { categoryName: newCategoryName },
          { where: { id, categoryName } },
        );

        if (!updatedCategory) {
          throw new Error("This product category does't exist");
        }

        return {
          message: `The product category was successfully updated to ${newCategoryName}`,
          error: false,
        };
      } catch (err) {
        return {
          message: err.message,
          error: true,
        };
      }
    },
    /**
     * Add a new product category
     *
     * @param {string} categoryName - name of the product category to add
     * @returns {*} result - result object containing a message, error,
     * and in case of success, a payload
     */
    addCategory: async categoryName => {
      try {
        const existingCategory = await ProductCategory.findOne({
          where: { categoryName },
        });

        if (existingCategory) {
          throw new Error(
            'This product category already exists. Please use a different category name',
          );
        }

        const newCategory = await ProductCategory.create({
          categoryName,
        });

        if (newCategory) {
          return {
            message: 'The category was added successfully',
            category: newCategory.categoryName,
            error: false,
          };
        }
      } catch (err) {
        return {
          message: err.message,
          error: true,
        };
      }
    },
    /**
     * Delete a product category
     *
     * @param {number} id - id of the category to delete
     * @param {string} categoryName - name of the category to delete
     */
    deleteCategory: (id, categoryName) => {},
    /**
     * Get a single product category by its id
     *
     * @param {number} id - the id of the product category to acquire
     */
    getCategoryById: id => {},
    /**
     * Get all product categories
     *
     */
    getAllCategories: () => {},
  };
};
