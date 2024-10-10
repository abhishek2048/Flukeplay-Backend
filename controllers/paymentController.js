// const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Razorpay = require("razorpay");
const { BadRequestError } = require("../errors/customErrors");

exports.processPayment = async (req, res, next) => {
  const RAZORPAY_ID_KEY = "rzp_test_crAbSXPPURNvZC";
  const RAZORPAY_SECRET_KEY = "my505zR44GDhNXGPu5YEIxih";

  const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY,
  });

  try {
    const amount = req.body.amount * 100;
    const options = {
      amount: amount,
      currency: "INR",
      receipt: req.body.psychologistId,
    };
    razorpayInstance.orders.create(options, (err, order) => {
      if (!err) {
        return new BadRequestError();
        res.status(200).send({
          success: true,
          msg: "Order Created",
          order_id: order.id,
          amount: amount,
          key_id: RAZORPAY_ID_KEY,
          product_name: "Therapy Session",
          description: `Therapy Session between psychologist with id : ${req.body.psychologistId} and user with id : ${req.body.userId}`,
          name: req.body.name,
          email: req.body.email,
        });
      } else {
        res.status(400).send({ success: false, msg: "Something went wrong!" });
      }
    });
  } catch {}
};

exports.sendStripeApiKey = async (req, res, next) => {
  res.status(200).json({ stripeApiKey: "process.env.STRIPE_API_KEY" });
};
