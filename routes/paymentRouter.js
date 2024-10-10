const Router = require("express");
const {
  processPayment,
  sendStripeApiKey,
} = require("../controllers/paymentController");
const router = Router();

router.route("/process").post(processPayment);
router.route("/api-key").get(sendStripeApiKey);

module.exports = router;
