const walkService = require('../services/walk');

const create = async (req, res, next) => {
  try {
    const newWalk = await walkService.create(req.body);
    res.status(201).json({
      data: newWalk,
    });
  } catch (err) {
    next(err);
  }
};

const getAll = (_req, res, next) => {
  try {
    const walks = walkService.getAll();
    res.json({
      data: walks,
    });
  } catch (err) {
    next(err);
  }
};

const getOne = (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const walk = walkService.getOne(id);
    res.json({
      data: walk,
    });
  } catch (err) {
    next(err);
  }
};

const replace = (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const updatedWalk = walkService.replace(id, req.body);
    res.json({
      data: updatedWalk,
    });
  } catch (err) {
    next(err);
  }
};

const update = (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const updatedWalk = walkService.update(id, req.body);
    res.json({
      data: updatedWalk,
    });
  } catch (err) {
    next(err);
  }
};

const deleteOne = (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const deletedWalk = walkService.deleteOne(id);
    res.json({ data: deletedWalk });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getAll, getOne, replace, update, deleteOne };
