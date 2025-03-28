const { NotFoundError } = require("../middleware/errors");
const Court = require("../models/Court");

const createOne = async (body) => {
  const newCourt = new Court(body);
  await newCourt.save();
  return newCourt;
};

const getAll = async () => {
  const courts = await Court.find();
  return courts;
};

const getOne = async (id) => {
  const court = await Court.findById(id);
  if (!court) throw new NotFoundError(`court with id ${id} not found`);
  return court;
};

const updateOne = async (id, body) => {
  console.log(id, { $set: body }, { runValidators: true });
  const court = await Court.findByIdAndUpdate(id, body, {
    runValidators: true,
    new: true,
  });
  if (!court) throw new NotFoundError(`court with id ${id} not found`);
  return court;
};

const deleteOne = async (id) => {
  const court = await Court.findByIdAndDelete(id);
  if (!court) throw new NotFoundError(`court with id ${id} not found`);
  return court;
};

module.exports = {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
};
