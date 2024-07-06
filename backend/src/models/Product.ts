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
import Sale from "./Sale";

@Table({ tableName: "Products" })
class Product extends Model<Product> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  quantity: number;

  @Column
  amount: number;

  @ForeignKey(() => Sale)
  @Column
  saleId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => Sale)
  sale: Sale;

}

export default Product;


