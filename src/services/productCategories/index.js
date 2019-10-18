/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
const { ProductCategory } = require('../../models').models;

/**
 * Product Category service
 * @module category/service
 */
module.exports = ProductCategorys => {
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
    deleteCategory: async (id, categoryName) => {
      try {
        const deleteSuccess = await ProductCategory.destroy({
          where: { id, categoryName },
        });

        if (deleteSuccess === 1) {
          return {
            message: `Successfully deleted ${categoryName} category`,
            error: false,
          };
        }

        throw new Error(
          'Something went wrong while deleting this category',
        );
      } catch (err) {
        return {
          message: err.message,
          error: true,
        };
      }
    },
    /**
     * Get a single product category by its id
     *
     * @param {number} id - the id of the product category to acquire
     */
    getCategoryById: async id => {
      try {
        const categoryResult = await ProductCategory.findOne({
          where: { id },
        });

        if (!categoryResult) {
          throw new Error(`No category with id ${id} was found`);
        }

        return {
          category: {
            id: categoryResult.id,
            category_name: categoryResult.categoryName,
          },
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
     * Get all product categories
     *
     */
    getAllCategories: async () => {
      try {
        const categories = await ProductCategory.findAll();

        if (!categories) {
          throw new Error('No categories found');
        }

        const categoryResult = categories.map(category => {
          return {
            id: category.id,
            category_name: category.categoryName,
          };
        });

        return {
          count: categoryResult.length,
          categories: categoryResult,
          error: false,
        };
      } catch (err) {
        return {
          message: err.message,
          error: true,
        };
      }
    },
  };
};
