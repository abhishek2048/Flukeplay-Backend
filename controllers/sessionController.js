const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors/customErrors");
const SessionModel = require("../models/SessionModel");

module.exports.setSessionLink = async (req, res, next) => {
  try {
    await SessionModel.findByIdAndUpdate(req.query.sessionId, {
      meetLink: req.query.meetLink,
    });
    res
      .status(StatusCodes.OK)
      .json({ message: "The meet link was updated successfully" });
  } catch (e) {
    return next(new BadRequestError(e.message));
  }
};

module.exports.getSessionDetails = async (req, res, next) => {
  try {
    const session = await SessionModel.findById(req.query.id);
    res.status(StatusCodes.OK).json(session);
  } catch (e) {
    return next(new BadRequestError(e.message));
  }
};
