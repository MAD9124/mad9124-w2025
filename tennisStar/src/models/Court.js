const { Schema, model } = require("mongoose");

const courtSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 250,
    },
    count: {
      type: Number,
      required: true,
      min: 1,
      max: 99,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = model("Court", courtSchema);
