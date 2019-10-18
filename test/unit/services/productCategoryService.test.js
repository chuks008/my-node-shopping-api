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

  describe('Get All categories tests', () => {
    afterEach(() => {
      ProductCategory.findAll.restore();
    });

    it('should return an error response when there are no categories found', async () => {
      const errorMsg = 'No categories found';
      sinon.stub(ProductCategory, 'findAll').resolves(null);
      const categoryResult = await sut.getAllCategories();

      expect(categoryResult.error).to.be.true;
      assert.equal(categoryResult.message, errorMsg);
    });

    it('should return a success response when categories are found', async () => {
      const categoriesResponse = [
        {
          id: 1,
          name: 'toys',
        },
        {
          id: 2,
          name: 'food',
        },
      ];

      sinon
        .stub(ProductCategory, 'findAll')
        .resolves(categoriesResponse);

      const categoryResult = await sut.getAllCategories();

      expect(categoryResult).contains.keys('categories', 'count');
      expect(categoryResult.error).to.be.false;
      expect(categoryResult.count).to.equal(2);
      expect(categoryResult.categories[0]).contains.keys(
        'category_name',
      );
    });
  });

  describe('Get category by ID tests', () => {
    afterEach(() => {
      ProductCategory.findOne.restore();
    });

    const categoryId = 45;

    it('should return an error response when there is no category found', async () => {
      const errorMsg = `No category with id ${categoryId} was found`;

      sinon.stub(ProductCategory, 'findOne').resolves(null);
      const categoryResult = await sut.getCategoryById(categoryId);

      expect(categoryResult.error).to.be.true;
      assert.equal(categoryResult.message, errorMsg);
    });

    it('should return a success response when a category is found', async () => {
      const categoryResponse = {
        id: 45,
        name: 'food',
      };

      sinon
        .stub(ProductCategory, 'findOne')
        .resolves(categoryResponse);

      const categoryResult = await sut.getCategoryById(categoryId);

      expect(categoryResult).contains.keys('category');
      expect(categoryResult.error).to.be.false;
      expect(categoryResult.category).has.keys('category_name', 'id');
    });
  });

  describe('Delete category tests', () => {
    afterEach(() => {
      ProductCategory.destroy.restore();
    });

    const categoryId = 45;
    const categoryName = 'food';

    it('should return an error response when a category was not deleted succesfully', async () => {
      const failureMessage = `Something went wrong while deleting this category`;
      sinon.stub(ProductCategory, 'destroy').resolves(0);

      const deleteResponse = await sut.deleteCategory(
        categoryId,
        categoryName,
      );

      expect(deleteResponse.error).to.be.true;
      assert.equal(deleteResponse.message, failureMessage);
    });

    it('should return a success response when a category is successfully deleted', async () => {
      const successMessage = `Successfully deleted ${categoryName} category`;
      sinon.stub(ProductCategory, 'destroy').resolves(1);

      const deleteResponse = await sut.deleteCategory(
        categoryId,
        categoryName,
      );

      expect(deleteResponse.error).to.be.false;
      assert.equal(deleteResponse.message, successMessage);
    });
  });
});
