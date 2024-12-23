import { model, Document, Schema } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export interface IProduct extends Document {
  pd_id: string;
  pd_code: string;
  pd_ct_id: Schema.Types.ObjectId;
  pd_name: string;
  pd_price: number;
  pd_created_at: Date;
  pd_updated_at: Date;
}

const productSchema = new Schema<IProduct>({
  pd_id: {
    type: String,
    default: uuidv4,
    unique: true,
    required: true,
  },
  pd_code: {
    type: String,
    required: true,
  },
  pd_ct_id: {
    type: Schema.Types.ObjectId,
		ref: 'Category',
    required: true,
  },
  pd_name: {
    type: String,
    required: true,
  },
  pd_price: {
    type: Number,
    min: 1000,
    required: true,
  },
  pd_created_at: {
    type: Date,
		default: Date.now,
    required: true,
  },
  pd_updated_at: {
    type: Date,
		default: Date.now,
    required: true,
  },
});

const Product = model<IProduct>("Product", productSchema);

export default Product;
