'use strict';

const testUsers = [
  {
    id: '705ea90f-5d54-48aa-8cfb-02af9c4f2900',
    login: 'testLogin',
    password: 'testPassword',
    age: '99',
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '400b8c9e-c22c-4b4c-8fd4-07be01ee2cb6',
    login: 'testLogin',
    password: 'testPassword',
    age: '99',
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2119d165-4245-4a7f-aa8a-00919c23a433',
    login: 'testLogin',
    password: 'testPassword',
    age: '99',
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Users', [...testUsers], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Users', null, {});
  }
};
