'use strict';

const authorsData = [
  {
    name: 'J.K. Rowling',
    birthdate: '1965-07-31',
    email: 'jkrowling@books.com',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'George R.R. Martin',
    birthdate: '1948-09-20',
    email: 'grrmartin@books.com',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const genresData = [
  {
    name: 'Fantasy',
    description: 'Magical and mythical stories.',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Drama',
    description: 'Fiction with realistic characters and events.',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const booksData = [
  {
    title: 'Harry Potter and the Philosopher\'s Stone',
    description: 'A young wizard\'s journey begins.',
    publicationYear: 1997,
    authorId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Game of Thrones',
    description: 'A medieval fantasy saga.',
    publicationYear: 1996,
    authorId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Insert authors
      await queryInterface.bulkInsert('Authors', authorsData);
      const authors = await queryInterface.sequelize.query(
        'SELECT * FROM "Authors";',
        { type: Sequelize.QueryTypes.SELECT }
      );

      // Insert genres
      await queryInterface.bulkInsert('Genres', genresData);
      const genres = await queryInterface.sequelize.query(
        'SELECT * FROM "Genres";',
        { type: Sequelize.QueryTypes.SELECT }
      );

      // Insert books
      await queryInterface.bulkInsert('Books', booksData);

      // Associate books with genres manually
      const bookGenres = [
        { bookId: 1, genreId: genres[0].id, createdAt: new Date(), updatedAt: new Date() }, // Harry Potter -> Fantasy
        { bookId: 2, genreId: genres[0].id, createdAt: new Date(), updatedAt: new Date() }, // Game of Thrones -> Fantasy
        { bookId: 2, genreId: genres[1].id, createdAt: new Date(), updatedAt: new Date() }  // Game of Thrones -> Drama
      ];
      await queryInterface.bulkInsert('BookGenres', bookGenres);
    } catch (error) {
      console.error('Seeding error:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('BookGenres', null, {});
    await queryInterface.bulkDelete('Books', null, {});
    await queryInterface.bulkDelete('Genres', null, {});
    await queryInterface.bulkDelete('Authors', null, {});
  }
};
