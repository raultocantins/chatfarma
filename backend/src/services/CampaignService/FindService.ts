import Campaign from "../../models/Campaign";



const FindService = async (): Promise<Campaign[]> => {
  const notes: Campaign[] = await Campaign.findAll({
    order: [["name", "ASC"]]
  });

  return notes;
};

export default FindService;
