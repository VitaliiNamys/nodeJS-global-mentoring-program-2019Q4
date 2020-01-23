'use strict';

const testUsers = [
  {
    id: 'c8c79fbc-8263-46d5-b2b4-2b4a5ce6d05d',
    login: 'user1',
    password: 'password',
    age: 20,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '8db27cfd-8445-45e3-bf33-c43dc0947352',
    login: 'user2',
    password: 'password',
    age: 20,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '18297896-1bec-45ea-81f2-38c933cd6e29',
    login: 'user3',
    password: 'password',
    age: 20,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Users',
      testUsers,
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(
      'Users',
      testUsers.map(user => { id: user.id }),
      {},
    );
  }
};
