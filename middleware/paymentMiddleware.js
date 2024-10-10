const { BadRequestError } = require("../errors/customErrors");
const UserModel = require("../models/UserModel");
const WalletTransactionsModel = require("../models/WalletTransactionsModel");

const createTransaction = async (req, res, next) => {
  const { userId, amount, date, type, paymentId } = req.body;
  const user = await UserModel.findById(userId);
  const currentBalance = user.walletBalance;
  const closingBalance = currentBalance + amount;
  try {
    await WalletTransactionsModel.create({
      userId,
      amount,
      date,
      closingBalance,
      type,
      paymentId,
    });
    next();
  } catch (error) {
    return next(new BadRequestError(error.message));
  }
};
// const stripe = require("stripe")(process.env.STRIPE_SECRET);

// module.exports.payment = async (req, res, next) => {
//   const user = await UserModel.findById(req.body.userId);
//   const customerId = user.customerId;
//   const { amount, email } = req.body;

//   await stripe.customers
//     .create({
//       email: email,
//       source: "tok_visa",
//       name: "test user",
//     })
//     .then((customer) => {
//       return stripe.charges.create({
//         amount: parseFloat(amount) * 100,
//         description: Payment for INR ${amount},
//         currency: "INR",
//         customer: customer.id,
//       });
//     })
//     .then((charge) => res.status(200).json(charge))
//     .catch((err) => next(new BadRequestError(err.message)));
// };

// module.exports.createToken = async (req, res, next) => {
//   var param = {};
//   //   param.card = {
//   //     number: req.body.card.number,
//   //     exp_month: req.body.card.exp_month,
//   //     exp_year: req.body.card.exp_year,
//   //     cvc: req.body.card.cvc,
//   //   };
//   param.card = {
//     number: "4242424242424242",
//     exp_month: 2,
//     exp_year: 2024,
//     cvc: "212",
//   };

//   console.log("Insider createToken");
//   await stripe.tokens.create(param, function (err, token) {
//     if (err) {
//       console.log(err.message);
//       return new BadRequestError();
//     }
//     if (token) {
//       console.log("success: " + JSON.stringify(token, null, 2));
//     } else {
//       console.log("Something wrong");
//     }
//   });
//   next();
// };
module.exports = {
  createTransaction,
};
