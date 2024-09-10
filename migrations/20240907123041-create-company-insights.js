'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Companies', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      rating: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      isghostjob: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      num_feedback: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      jobposts: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      numapplicants: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      avgfeedbacktime: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      ghostjobprobability: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      avglistingduration: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      numrejection: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Companies');
  }
};
