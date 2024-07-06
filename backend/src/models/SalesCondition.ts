import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement,
  Model,
} from "sequelize-typescript";

@Table
class SalesCondition extends Model<SalesCondition> {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

}

export default SalesCondition;
