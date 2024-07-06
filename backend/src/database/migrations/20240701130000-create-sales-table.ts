import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("Sales", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      conditionId: {
        type: DataTypes.INTEGER,
        references: { model: "SalesConditions", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },

      userId: {
        type: DataTypes.INTEGER,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
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
    return queryInterface.dropTable("Sales");
  }
};
