'use strict';

const fetch = (url) =>
  import('node-fetch').then(({ default: fetch }) => fetch(url));

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let movies = await fetch('https://ghibliapi.herokuapp.com/films');
    movies = await movies.json();
    let movieArray = movies.map((movie) => ({
      code: movie.id,
      title: movie.title,
      stock: 10,
      rentals: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    return queryInterface.bulkInsert('Movies', movieArray);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
