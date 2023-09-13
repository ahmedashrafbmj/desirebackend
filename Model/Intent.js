const mongoose = require('mongoose');

const paymentIntentSchema = new mongoose.Schema({
  paymentIntentId: { type: String, required: true },
  amount: { type: Number, required: true },
  customer: { type: String, required: true }
  // Add other fields as per your requirements
});

const PaymentIntentModel = mongoose.model('PaymentIntent', paymentIntentSchema);

module.exports = PaymentIntentModel;
