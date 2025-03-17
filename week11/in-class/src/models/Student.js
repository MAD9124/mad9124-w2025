const { model, Schema } = require('mongoose');

const studentSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 64,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 64,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Student', studentSchema);
