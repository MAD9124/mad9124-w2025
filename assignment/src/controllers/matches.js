const matches = require("../models/matches.json");

const keyNames = ["court", "player1", "player2", "scores", "winner"];

const hasAllProperties = ({ court, player1, player2, scores, winner }) =>
  court &&
  player1 &&
  player2 &&
  Array.isArray(scores) &&
  scores.length > 1 &&
  winner;

const createOne = (req, res) => {
  if (!hasAllProperties(req.body)) {
    res.status(400).json({
      error: "Missing required field",
    });
    return;
  }
  const { court, player1, player2, scores, winner } = req.body;

  const newMatch = {
    id: Date.now(),
    court,
    player1,
    player2,
    scores,
    winner,
  };
  matches.push(newMatch);
  res.status(201).json({ data: newMatch });
};

const getAll = (_req, res) => {
  res.json({ data: matches });
};

const getOne = (req, res) => {
  const id = +req.params.id;
  const foundMatch = matches.find((match) => match.id === id);

  if (!foundMatch) {
    res.status(404).json({
      error: `Match with id ${id} not found`,
    });
    return;
  }
  res.json({ data: foundMatch });
};

const replaceOne = (req, res) => {
  if (!hasAllProperties(req.body)) {
    res.status(400).json({
      error: "Missing required field",
    });
    return;
  }
  const id = +req.params.id;
  const foundMatch = matches.find((match) => match.id === id);

  if (!foundMatch) {
    res.status(404).json({
      error: `Match with id ${id} not found`,
    });
    return;
  }

  const { court, player1, player2, scores, winner } = req.body;

  foundMatch.court = court;
  foundMatch.player1 = player1;
  foundMatch.player2 = player2;
  foundMatch.scores = scores;
  foundMatch.winner = winner;

  res.json({ data: foundMatch });
};

const updateOne = (req, res) => {
  const id = +req.params.id;
  const foundMatch = matches.find((match) => match.id === id);

  if (!foundMatch) {
    res.status(404).json({
      error: `Match with id ${id} not found`,
    });
    return;
  }

  keyNames.forEach((key) => {
    if (key === "scores") {
      // special logic for arrays
      const { scores } = req.body;
      if (Array.isArray(scores) && scores.length > 2) {
        foundMatch.scores = scores;
      }
      return;
    }
    if (req.body[key]) {
      foundMatch[key] = req.body[key];
    }
  });

  res.json({ data: foundMatch });
};

const deleteOne = (req, res) => {
  const id = +req.params.id;
  const matchIdx = matches.findIndex((match) => match.id === id);

  if (matchIdx === -1) {
    res.status(404).json({
      error: `Match with id ${id} not found`,
    });
    return;
  }
  const [deletedMatch] = matches.splice(matchIdx);
  res.json({
    data: deletedMatch,
  });
};

module.exports = {
  createOne,
  getAll,
  getOne,
  replaceOne,
  updateOne,
  deleteOne,
};
