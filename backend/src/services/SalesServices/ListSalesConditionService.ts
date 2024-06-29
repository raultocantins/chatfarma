import SalesCondition from "../../models/SalesCondition";

const ListSalesConditionsService = async (): Promise<SalesCondition[]> => {
  const salesConditions = await SalesCondition.findAll({
    attributes: ["id", "name"]
  });

  return salesConditions;
};

export default ListSalesConditionsService;
