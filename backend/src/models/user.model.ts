import { model, models, Schema } from 'mongoose';
import { addressSchema } from './address.model';

const userSchema = new Schema(
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
