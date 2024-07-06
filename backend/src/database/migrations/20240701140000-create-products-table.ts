import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("Products", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      amount: {
        type: DataTypes.FLOAT,
        allowNull: false
      },

      saleId: {
        type: DataTypes.INTEGER,
        references: { model: "Sales", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false
      },

      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },

      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("Products");
  }
};
