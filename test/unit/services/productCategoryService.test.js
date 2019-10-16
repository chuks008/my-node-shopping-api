const sinon = require('sinon');
const { expect } = require('chai');
const assert = require('assert');
const { ProductCategory } = require('../../../src/models').models;
const sut = require('../../../src/services/productCategories')(
  ProductCategory,
);

describe('Product Category tests', () => {
  describe('Add Product category tests', () => {
    afterEach(() => {
      ProductCategory.findOne.restore();
    });

    const categoryName = 'toy';
    const category = {
      id: 1,
      categoryName: 'toy',
    };

    it('should return an error response if category already exists', async () => {
      const errorMessage =
        'This product category already exists. Please use a different category name';
      sinon.stub(ProductCategory, 'findOne').resolves(category);
      const errorResponse = await sut.addCategory(categoryName);
      expect(errorResponse.error).to.be.true;
      expect(errorResponse.message).to.equal(errorMessage);
    });

    it('should return a success response if the category was successfully created', async () => {
      sinon.stub(ProductCategory, 'findOne').resolves(null);
      sinon.stub(ProductCategory, 'create').resolves(category);
      const successResponse = await sut.addCategory(categoryName);

      expect(successResponse).to.contain.key('category');
      expect(successResponse.error).to.be.false;
      expect(successResponse.message).to.equal(
        'The category was added successfully',
      );
      expect(successResponse.category).to.equal(categoryName);
    });
  });

  describe('Update product category tests', () => {
    const productCategoryId = 45;
    const oldCategoryName = 'food';
    const newCategoryName = 'perishables';

    afterEach(() => {
      ProductCategory.update.restore();
    });

    it('should return an error response when the category does not exist', async () => {
      const errorMsg = "This product category does't exist";
      sinon.stub(ProductCategory, 'update').resolves(null);
      const updateResponse = await sut.updateCategory(
        productCategoryId,
        oldCategoryName,
        newCategoryName,
      );

      expect(updateResponse.error).to.be.true;
      assert.equal(updateResponse.message, errorMsg);
    });

    it('should return a success response when the category was successfully updated', async () => {
      const successMsg = `The product category was successfully updated to ${newCategoryName}`;
      const updatedCategory = {
        id: productCategoryId,
        categoryName: newCategoryName,
      };

      sinon.stub(ProductCategory, 'update').resolves(updatedCategory);

      const updateResponse = await sut.updateCategory(
        productCategoryId,
        oldCategoryName,
        newCategoryName,
      );

      expect(updateResponse.error).to.be.false;
      assert.equal(updateResponse.message, successMsg);
    });
  });
});
