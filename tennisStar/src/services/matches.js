const { NotFoundError, BadRequestError } = require('../middleware/errors');
const Match = require('../models/Match');

const validateWinner = (match) => {
  if (!match.winner) return;
  const winners = match.sets.reduce(
    (acc, cv) => {
      if (cv[0] > cv[1]) acc[0] += 1;
      else if (cv[1] > cv[0]) acc[1] += 1;
      return acc;
    },
    [0, 0]
  );
  const winner = winners[0] > winners[1] ? match.player1 : match.player2;
  if (winner !== match.winner) throw new BadRequestError('invalid winner');
};

const createOne = async (body) => {
  validateWinner(body);
  const newMatch = new Match(body);
  await newMatch.save();
  return newMatch;
};

const getAll = async () => {
  const matches = await Match.find().populate('court');
  return matches;
};

const getOne = async (id) => {
  const match = await Match.findById(id).populate('court');
  if (!match) throw new NotFoundError(`match with id ${id} not found`);
  return match;
};

const updateOne = async (id, body) => {
  if (body.winner) {
    if (body.player1 && body.player2 && body.sets) {
      validateWinner(body);
    } else {
      const foundMatch = await Match.findById(id).lean();
      if (!foundMatch) throw new NotFoundError(`match with id ${id} not found`);
      validateWinner({ ...foundMatch, winner: body.winner });
    }
  }
  const match = await Match.findByIdAndUpdate(id, body, {
    runValidators: true,
    new: true,
  }).populate('court');
  if (!match) throw new NotFoundError(`match with id ${id} not found`);
  return match;
};

const deleteOne = async (id) => {
  const match = await Match.findByIdAndDelete(id).populate('court');
  if (!match) throw new NotFoundError(`match with id ${id} not found`);
  return match;
};

module.exports = {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
};
