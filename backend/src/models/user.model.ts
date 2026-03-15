import { model, models, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      require: true,
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
    addresses: [],
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true },
);

const userModel = models || model('User', userSchema);

export default userModel;
