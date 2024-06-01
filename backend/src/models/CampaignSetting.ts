import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo
} from "sequelize-typescript";

@Table({ tableName: "CampaignSettings" })
class CampaignSetting extends Model<CampaignSetting> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  key: string;

  @Column
  value: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;


}

export default CampaignSetting;
