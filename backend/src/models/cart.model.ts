import { model, models, Schema } from 'mongoose';

const cartItemSchema = new Schema({
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
