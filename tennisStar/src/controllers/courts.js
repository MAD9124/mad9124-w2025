const CourtService = require("../services/courts");
const { requestHandler } = require("./utils");

const createOne = requestHandler(async (req, res) => {
  const newCourt = await CourtService.createOne(req.body);
  res.status(201).json({
    data: newCourt,
  });
});

const getAll = requestHandler(async (_, res) => {
  const courts = await CourtService.getAll();
  res.json({
    data: courts,
  });
});

const getOne = requestHandler(async (req, res) => {
  const court = await CourtService.getOne(req.params.id);
  res.json({
    data: court,
  });
});

const updateOne = requestHandler(async (req, res) => {
  const court = await CourtService.updateOne(req.params.id, req.body);
  res.json({
    data: court,
  });
});

const deleteOne = requestHandler(async (req, res) => {
  const court = await CourtService.deleteOne(req.params.id);
  res.json({
    data: court,
  });
});

module.exports = {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
};
