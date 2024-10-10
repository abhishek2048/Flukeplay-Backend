const { StatusCodes } = require("http-status-codes");
const SessionModel = require("../models/SessionModel");
const UserModel = require("../models/UserModel");
const { BadRequestError } = require("../errors/customErrors");
const WalletTransactionsModel = require("../models/WalletTransactionsModel");
const ScheduleModel = require("../models/ScheduleModel");
//generates a session and adds the session Id to the request
module.exports.generateSession = async (req, res, next) => {
  console.log("generateSessionMiddleware");
  try {
    const { psychologistId, userId, date, meetLink, slot,  walletTransactionId } =
      req.body;
    console.log({
      psychologistId,
      userId,
      date,
      meetLink,
      walletTransactionId,
    });
    const session = await SessionModel.create({
      psychologistId,
      userId,
      date,
      meetLink,
      walletTransactionId,
      slot,
    });
    console.log(session);
    req.body.sessionId = session._id;
    next();
  } catch (e) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: e.message });
  }
};

//updates the schedule for the psychologist and the user according to the session details
module.exports.updateSessionSchedule = async (req, res, next) => {
  console.log("updateSessionScheduleMiddleware");
  const { userId, psychologistId, sessionId } = req.body;

  try {
    const user = await UserModel.findById(userId);
    // await user.sessionUpdator();
    user.sessions.push(sessionId);
    await user.save();

    const { date, slot } = req.body;
    //also needs middleware to verify psyId and authorization
    let schedule = await ScheduleModel.findOne({
      psychologistId: psychologistId,
      date: date,
    });
    if (!schedule) {
      schedule = await ScheduleModel.create({
        psychologistId: psychologistId,
        date: date,
        slots: slot 
      });
    }

    if (schedule.slots.includes(slot)) {
      const index = schedule.slots.indexOf(slot);
      schedule.slots.splice(index, 1);
    }

    await schedule.save();
    next();
  } catch (e) {
    next(new BadRequestError(e.message));
  }
};

//to generate the transaction for  the user
module.exports.generateTransaction = async (req, res, next) => {
  console.log("generateTransactionMiddleware");
  try {
    const { userId, amount, closingBalance, type, paymentId } = req.body;
    const date = Date.now();
    const transaction = await WalletTransactionsModel.create({
      userId,
      amount,
      date,
      //transactionDate,
      closingBalance,
      type,
      paymentId,
    });
    await transaction.save();
    req.body.walletTransactionId = transaction._id;
    next();
  } catch (error) {
    next(new BadRequestError(error.message));
  }
};
