module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'ProductCategories',
      [
        {
          id: 1,
          categoryName: 'Food',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          categoryName: 'Gardening',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('Products', null, {});
  },
};
