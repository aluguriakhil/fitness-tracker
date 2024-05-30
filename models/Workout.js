const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  intensity: {
    type: String,
    required: true
  },
  exercise: {
    type: String,
    required: true
  },
  caloriesBurnt: {
    type: Number,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }
});

module.exports = Workout = mongoose.model('workout', WorkoutSchema);
