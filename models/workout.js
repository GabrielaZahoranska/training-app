const mongoose = require('mongoose')

const workoutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    workoutDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    focus: {
      type: String,
      required: true,
      trim: true,
    },
    intensity: {
      type: String,
      enum: ['Low', 'Moderate', 'High'],
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Workout', workoutSchema)
