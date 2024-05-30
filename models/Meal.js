const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  calories: {
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }
});

module.exports = Meal = mongoose.model('meal', MealSchema);
