const Router = require("express");
const router = Router();

const {
  setSessionLink,
  getSessionDetails,
} = require("../controllers/sessionController.js");
router.route("/link").post(setSessionLink);
router.route("/").get(getSessionDetails);

module.exports = router;
