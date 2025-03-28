const { Schema, model, Types } = require("mongoose");

const matchSchema = new Schema(
  {
    court: {
      type: Types.ObjectId,
      ref: "Court",
    },
    player1: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 64,
    },
    player2: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 64,
    },
    sets: {
      type: [
        {
          type: [
            {
              type: Number,
              required: true,
              minLength: 1,
              maxLength: 99,
            },
          ],
        },
      ],
      validate: [
        (arr) => {
          return (
            arr.length >= 2 &&
            arr.length <= 5 &&
            arr.every((a) => a.length === 2)
          );
        },
        "invalid sets",
      ],
    },
    winner: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 64,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = model("Match", matchSchema);
