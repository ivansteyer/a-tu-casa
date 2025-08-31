module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('properties', 'published', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.addColumn('properties', 'photos', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('properties', 'm2', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('properties', 'ascensor', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
    await queryInterface.addColumn('properties', 'altura', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('properties', 'altura');
    await queryInterface.removeColumn('properties', 'ascensor');
    await queryInterface.removeColumn('properties', 'm2');
    await queryInterface.removeColumn('properties', 'photos');
    await queryInterface.removeColumn('properties', 'published');
  }
};