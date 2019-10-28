/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */

module.exports = Product => {
  return {
    /**
     * Add a new product
     *
     * @param {*} name - name of the new product
     * @param {*} categoryId - product category of the new product
     */
    addProduct: async (name, categoryId) => {
      try {
        const existingProduct = await Product.findOne({
          where: { name },
        });

        if (existingProduct) {
          throw new Error(
            'This product already exists. Please use a different product name',
          );
        }

        const newProduct = await Product.create({
          name,
          categoryId,
        });

        if (newProduct) {
          return {
            message: 'The product was added successfully',
            product_name: newProduct.name,
            category_id: newProduct.categoryId,
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
     * Get a specific product by using its id
     *
     * @param {*} productId - product id for the product to get
     */
    getProductById: async productId => {
      try {
        const product = await Product.findOne({
          where: { id: productId },
        });

        if (!product) {
          throw new Error(
            `No product with id ${productId} was found`,
          );
        }

        return {
          product: {
            id: product.id,
            product_name: product.categoryName,
            category_id: product.categoryId,
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
     * Get a list of products in db
     *
     */
    getAllProducts: async () => {
      try {
        const products = await Product.findAll();

        if (!products) {
          throw new Error('No products found');
        }

        const productResult = products.map(product => {
          return {
            id: product.id,
            product_name: product.name,
          };
        });

        return {
          count: productResult.length,
          products: productResult,
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
     * Update the name of a product
     *
     * @param {*} productId - product id of product to update
     * @param {*} newProductName - new product name after the update
     */
    updateProduct: async (productId, newProductName) => {
      try {
        const updatedProduct = await Product.update(
          { name: newProductName },
          { where: { id: productId } },
        );

        if (!updatedProduct) {
          throw new Error("This product does't exist");
        }

        return {
          message: `The product was successfully updated to ${newProductName}`,
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
     * Delete a product
     *
     * @param {*} productId - id for product to be deleted
     */
    deleteProduct: async productId => {
      try {
        const deleteSuccess = await Product.destroy({
          where: { id: productId },
        });

        if (deleteSuccess === 1) {
          return {
            message: `Successfully deleted product`,
            error: false,
          };
        }

        throw new Error(
          'Something went wrong while deleting this product',
        );
      } catch (err) {
        return {
          message: err.message,
          error: true,
        };
      }
    },
  };
};
