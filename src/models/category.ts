import { model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ICategory extends Document {
  ct_id: string;
  ct_code: string;
  ct_name: string;
  ct_created_at: Date;
  ct_updated_at: Date;
}

const categorySchema = new Schema<ICategory>({
  ct_id: {
    type: String,
    default: uuidv4,
    unique: true,
    required: true,
  },
  ct_code: {
    type: String,
    required: true,
  },
  ct_name: {
    type: String,
    required: true,
  },
  ct_created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
  ct_updated_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Category = model<ICategory>("Category", categorySchema);

export default Category;
