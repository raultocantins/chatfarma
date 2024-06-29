import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.bulkInsert(
      "SalesConditions",
      [
        {
          name: "VENDIDO",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "FORA DO ALCANCE DE ENTREGA",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "PREÇO NÃO COMPETITIVO",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "CANCELADO PELO CLIENTE",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "DEVOLVIDO",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "TROCA SOLICITADA",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "PEDIDO REEMBOLSO",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "OUTROS",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.bulkDelete("SalesConditions", {});
  }
};
