const Court = require("../models/Court");

const createOne = async (body) => {
  const newCourt = new Court(body);
  await newCourt.save();
  return newCourt;
};

module.exports = {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
};
