const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  products: [
    {
      productId: {
        type: String,
        // ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  userId: {
    type: String,
    // ref: "User",
    // required: true,
  },
  email: {
    type: String,
  },

  address: {
    type: String,
  },

  contact: [
    {
      type: String,
    },
  ],
  name: {
    type: String,
  },
  lastName: {
    type: String,
  },
  totalprice: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
