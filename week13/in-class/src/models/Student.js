const { model, Schema, Types } = require('mongoose');

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
    owner: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    images: {
      type: [String],
      validate: [(images) => images.length > 0, 'Minimum 1 image required'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Student', studentSchema);
