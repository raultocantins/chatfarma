import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  HasMany
} from "sequelize-typescript";
import SalesCondition from "./SalesCondition";
import User from "./User";
import Product from "./Product";
import Contact from "./Contact";
import Queue from "./Queue";

@Table({ tableName: "Sales" })
class Sale extends Model<Sale> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @ForeignKey(() => SalesCondition)
  @Column
  conditionId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Queue)
  @Column
  queueId: number;

  @ForeignKey(() => Contact)
  @Column
  contactId: number;

  @BelongsTo(() => SalesCondition)
  condition: SalesCondition;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Contact)
  contact: Contact;

  @HasMany(() => Product)
  productList: Product[];

}

export default Sale;
