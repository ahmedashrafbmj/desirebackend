const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PaymentIntentModel = require("../Model/Intent")
// const processPayment = async (req, res) => {
//   const { token,amount} = req.body;
//   // console.log(req.body)

//   try {
//     // const paymentMethod = await stripe.paymentMethods.create({
//     //   type: 'card',
//     //   card: {
//     //     number: cardNumber,
//     //     exp_month: expMonth,
//     //     exp_year: expYear,
//     //     cvc: cvc
//     //   }
//     // });
//     // console.log(paymentMethod.id,"paymentMethod.id")
//     // const testToken = 'tok_visa';

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: 'usd',
//       payment_method: token,
//       confirm: true
//     });

//     // Handle successful payment
//     res.send('Payment succeeded!');
//   } catch (error) {
//     // Handle payment error
//     res.status(500).send({ success: false, error: error.message });
//   }
// };

// module.exports = {
//   processPayment
// };



// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const PaymentIntentModel = require('./database'); // Assuming you have the Mongoose model exported from a separate file

const processPayment = async (req, res) => {
  const { token, amount } = req.body;

  try {
    // Convert amount from cents to dollars
    const convertedAmount = amount * 100;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: convertedAmount,
      currency: 'usd',
      payment_method: token,
      confirm: false
    });

    // Save the payment intent details in your database for future reference
    const paymentIntentId = paymentIntent.id;
    const customer = req.body.customer;

    // Create a new payment intent document using the Mongoose model
    const newPaymentIntent = new PaymentIntentModel({
      paymentIntentId,
      amount: amount,
      customer
    });

    // Save the payment intent document in the database
    await newPaymentIntent.save();

     res.status(500).send({ success: true, message: "Payment intent created successfully!"});
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};



// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const confirmPayment = async (req, res) => {
  const { paymentIntentId } = req.body;

  try {
    // Retrieve the payment intent from your database using the paymentIntentId
    const paymentIntent = await PaymentIntentModel.findOne({ paymentIntentId });
    if (!paymentIntent) {
      throw new Error('Payment intent not found');
    }

    const amountToDeduct = paymentIntent.amount;
    const customer = paymentIntent.customer;

    // Deduct the amount manually
    // Perform the necessary logic to deduct the amount from the customer
    // Update the customer's balance or perform any other required deduction logic
    // ...

    // Confirm the payment intent in Stripe
    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

    // Check if the payment intent status is 'succeeded'
    if (confirmedPaymentIntent.status === 'succeeded') {
      // Update the payment intent status in your database
      paymentIntent.status = 'completed';
      await paymentIntent.save();

      // Return the response indicating successful payment
           res.status(500).send({ success: true, message: "Payment deducted and updated in Stripe successfully!"});

    } else {
      throw new Error('Payment intent confirmation failed');
    }
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};



module.exports = {
  processPayment,
  confirmPayment
};
