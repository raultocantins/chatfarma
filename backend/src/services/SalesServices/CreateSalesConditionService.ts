import SalesCondition from "../../models/SalesCondition";

const CreateSalesConditionsService = async (name: string): Promise<SalesCondition> => {
  const condition = await SalesCondition.create({
    name
  });

  return condition;
};

export default CreateSalesConditionsService;
