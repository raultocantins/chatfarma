import Campaign from "../../models/Campaign";
import { campaignQueue } from "../../queues";

export async function RestartService(id: number) {
  const campaign = await Campaign.findByPk(id);
  if (!campaign) {
    throw new Error("Campaign is null or undefined");
  }

  await campaign.update({ status: "EM_ANDAMENTO" });

  await campaignQueue.add("ProcessCampaign", {
    id: campaign.id,
    delay: 3000
  });
}
