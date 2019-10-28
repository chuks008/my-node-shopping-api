const sinon = require('sinon');
const { expect } = require('chai');
const assert = require('assert');
const { Product } = require('../../../src/models').models;
const sut = require('../../../src/services/products')(Product);

describe('Product tests', () => {
  describe('Add Product tests', () => {
    afterEach(() => {
      Product.findOne.restore();
    });

    const productName = 'toy';
    const categoryId = 5;
    const product = {
      id: 1,
      name: 'toy',
      categoryId: 5,
    };

    it('should return an error response if product already exists', async () => {
      const errorMessage =
        'This product already exists. Please use a different product name';
      sinon.stub(Product, 'findOne').resolves(product);
      const errorResponse = await sut.addProduct(
        productName,
        categoryId,
      );
      expect(errorResponse.error).to.be.true;
      expect(errorResponse.message).to.equal(errorMessage);
    });

    it('should return a success response if the product was successfully created', async () => {
      sinon.stub(Product, 'findOne').resolves(null);
      sinon.stub(Product, 'create').resolves(product);
      const successResponse = await sut.addProduct(
        productName,
        categoryId,
      );

      expect(successResponse).to.contain.key('product_name');
      expect(successResponse.error).to.be.false;
      expect(successResponse.message).to.equal(
        'The product was added successfully',
      );
      expect(successResponse.product_name).to.equal(productName);
      expect(successResponse.category_id).to.equal(categoryId);
    });
  });

  describe('Update product tests', () => {
    const productId = 45;
    const newProductName = 'Scrabble';

    afterEach(() => {
      Product.update.restore();
    });

    it('should return an error response when the product does not exist', async () => {
      const errorMsg = "This product does't exist";
      sinon.stub(Product, 'update').resolves(null);
      const updateResponse = await sut.updateProduct(
        productId,
        newProductName,
      );

      expect(updateResponse.error).to.be.true;
      assert.equal(updateResponse.message, errorMsg);
    });

    it('should return a success response when the product was successfully updated', async () => {
      const successMsg = `The product was successfully updated to ${newProductName}`;
      const updatedProduct = {
        id: productId,
        productName: newProductName,
      };

      sinon.stub(Product, 'update').resolves(updatedProduct);

      const updateResponse = await sut.updateProduct(
        productId,
        newProductName,
      );

      expect(updateResponse.error).to.be.false;
      assert.equal(updateResponse.message, successMsg);
    });
  });

  describe('Get All Products tests', () => {
    afterEach(() => {
      Product.findAll.restore();
    });

    it('should return an error response when there are no products found', async () => {
      const errorMsg = 'No products found';
      sinon.stub(Product, 'findAll').resolves(null);
      const productResult = await sut.getAllProducts();

      expect(productResult.error).to.be.true;
      assert.equal(productResult.message, errorMsg);
    });

    it('should return a success response when products are found', async () => {
      const productsResponse = [
        {
          id: 1,
          productName: 'Scrabble',
          categoryId: 7,
        },
        {
          id: 3,
          productName: 'Playing Cards',
          categoryId: 2,
        },
      ];

      sinon.stub(Product, 'findAll').resolves(productsResponse);

      const productResult = await sut.getAllProducts();

      expect(productResult).contains.keys('products', 'count');
      expect(productResult.error).to.be.false;
      expect(productResult.count).to.equal(2);
      expect(productResult.products[0]).contains.keys('product_name');
    });
  });

  describe('Get product by ID tests', () => {
    afterEach(() => {
      Product.findOne.restore();
    });

    const productId = 45;

    it('should return an error response when there is no product found', async () => {
      const errorMsg = `No product with id ${productId} was found`;

      sinon.stub(Product, 'findOne').resolves(null);
      const productResult = await sut.getProductById(productId);

      expect(productResult.error).to.be.true;
      assert.equal(productResult.message, errorMsg);
    });

    it('should return a success response when a product is found', async () => {
      const productResponse = {
        id: 45,
        name: 'food',
      };

      sinon.stub(Product, 'findOne').resolves(productResponse);

      const productResult = await sut.getProductById(productId);

      expect(productResult).contains.keys('product');
      expect(productResult.error).to.be.false;
      expect(productResult.product).has.keys(
        'product_name',
        'id',
        'category_id',
      );
    });
  });

  describe('Delete product tests', () => {
    afterEach(() => {
      Product.destroy.restore();
    });

    const productId = 45;

    it('should return an error response when a product was not deleted succesfully', async () => {
      const failureMessage = `Something went wrong while deleting this product`;
      sinon.stub(Product, 'destroy').resolves(0);

      const deleteResponse = await sut.deleteProduct(productId);

      expect(deleteResponse.error).to.be.true;
      assert.equal(deleteResponse.message, failureMessage);
    });

    it('should return a success response when a product is successfully deleted', async () => {
      const successMessage = `Successfully deleted product`;
      sinon.stub(Product, 'destroy').resolves(1);

      const deleteResponse = await sut.deleteProduct(productId);

      expect(deleteResponse.error).to.be.false;
      assert.equal(deleteResponse.message, successMessage);
    });
  });
});
