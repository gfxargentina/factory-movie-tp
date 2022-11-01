'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Users', 'role', {
        type: Sequelize.STRING,
        defaultValue: 'USER',
      }),
    ]);
  },
  async down(queryInterface, Sequelize) {
    //add reverting commands here
  },
};
