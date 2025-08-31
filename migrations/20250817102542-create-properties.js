module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('properties', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      ownerId: { type: Sequelize.INTEGER, allowNull: false },
      titulo: { type: Sequelize.STRING, allowNull: false },
      tipo: Sequelize.STRING,
      habitaciones: Sequelize.INTEGER,
      ubicacion: Sequelize.STRING,
      terraza: Sequelize.BOOLEAN,
      precio: Sequelize.INTEGER,
      modalidad: Sequelize.STRING,
      disponibleDesde: Sequelize.DATEONLY,
      descripcion: Sequelize.TEXT,
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('properties');
  }
};