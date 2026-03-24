import { Document, model, models, Schema, Types } from 'mongoose';

export interface ICart extends Document {
  product: Types.ObjectId;
  quantity: number;
}

const cartItemSchema = new Schema<ICart>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
});

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true },
);

const cartModel = models.Cart || model('Cart', cartSchema);

export default cartModel;
