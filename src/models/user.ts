import {  model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IUser extends Document {
  us_id: string;
  us_name: string;
  us_password: string;
  us_email: string;
  us_phone_number: string;
  us_address: string;
  us_created_at: Date;
  us_updated_at: Date;
}

const userSchema = new Schema<IUser>({
  us_id: {
    type: String,
    default: uuidv4,
    unique: true,
    required: true,
  },
  us_name: {
    type: String,
    maxlength: 50,
    required: true,
  },
  us_password: {
    type: String,
    required: true,
  },
  us_email: {
    type: String,
    required: true,
  },
  us_phone_number: {
    type: String,
    minlength: 10,
    maxlength: 13,
    required: true,
  },
  us_address: {
    type: String,
    required: true,
  },
  us_created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
  us_updated_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const User = model<IUser>("User", userSchema);

export default User;


userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.us_password;
    return ret;
  },
});
