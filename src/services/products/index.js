/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */

module.exports = Product => {
  return {
    /**
     * Add a new product
     *
     * @param {*} productName - name of the new product
     * @param {*} productCategory - product category of the new product
     */
    addProduct: (productName, productCategory) => {},
    /**
     * Get a specific product by using its id
     *
     * @param {*} productId - product id for the product to get
     */
    getProductById: productId => {},
    /**
     * Get a list of products based on a particular product category id
     *
     * @param {*} productCategoryId - id for the product category to find
     */
    getProductsByCategory: productCategoryId => {},
    /**
     * Update the name of a product
     *
     * @param {*} productId - product id of product to update
     * @param {*} newProductName - new product name after the update
     */
    updateProduct: (productId, newProductName) => {},
    /**
     * Delete a product
     *
     * @param {*} productId - id for product to be deleted
     */
    deleteProduct: productId => {},
  };
};
