import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
} from "sequelize-typescript";

@Table({
  tableName: "Stickers"
})

class Sticker extends Model<Sticker> {
  @PrimaryKey
  @Column
  id: string;

  @Column
  path: string;

  @Column
  name: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default Sticker;
