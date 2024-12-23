import { model, Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IOrder extends Document {
  or_id: string;
  or_pd_id: Schema.Types.ObjectId;
  or_amount: number;
  or_created_at: Date;
  or_updated_at: Date;
}

const orderSchema = new Schema<IOrder>({
  or_id: {
    type: String,
    default: uuidv4,
    unique: true,
    required: true,
  },
  or_pd_id: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  or_amount: {
    type: Number,
    required: true,
  },
  or_created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
  or_updated_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Order = model<IOrder>("Order", orderSchema);

export default Order;
