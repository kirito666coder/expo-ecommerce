import { Document, model, models, Schema, Types } from 'mongoose';
import { addressSchema, IAddress } from './address.model';

interface IUser extends Document {
  email: string;
  name: string;
  imageUrl: string;
  uid: string;
  addresses: IAddress[];
  wishlist: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    addresses: [addressSchema],
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true },
);

const userModel = models.User || model('User', userSchema);

export default userModel;
