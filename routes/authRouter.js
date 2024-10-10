const Router = require("express");

const router = Router();

const {
  bookPsychologist,
} = require("../controllers/psychologistController");

const { isBalanceSufficient } = require("../middleware/validationMiddleware");

router.route("/booking").post(isBalanceSufficient, bookPsychologist);

// router.get('/', userController.loadAuth);


module.exports = router;
