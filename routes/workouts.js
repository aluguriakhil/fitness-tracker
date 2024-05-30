const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Workout = require('../models/Workout');
const router = express.Router();

// @route    POST /api/workouts
// @desc     Create a workout
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('duration', 'Duration is required').isInt({ min: 1 }),
      check('date', 'Date is required').isISO8601(),
      check('time', 'Time is required').not().isEmpty(),
      check('intensity', 'Intensity is required').not().isEmpty(),
      check('exercise', 'Exercise is required').not().isEmpty(),
      check('caloriesBurnt', 'Calories burnt is required').isInt({ min: 1 })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, duration, date, time, intensity, exercise, caloriesBurnt } = req.body;

    try {
      const newWorkout = new Workout({
        name,
        duration,
        date,
        time,
        intensity,
        exercise,
        caloriesBurnt,
        user: req.user.id
      });

      const workout = await newWorkout.save();
      res.json(workout);
    } catch (err) {
      console.error('Error creating workout:', err.message);
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  }
);

// @route    GET /api/workouts
// @desc     Get all workouts
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT /api/workouts/:id
// @desc     Update a workout
// @access   Private
router.put(
  '/:id',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('duration', 'Duration is required').isInt({ min: 1 }),
      check('date', 'Date is required').isISO8601(),
      check('time', 'Time is required').not().isEmpty(),
      check('intensity', 'Intensity is required').not().isEmpty(),
      check('exercise', 'Exercise is required').not().isEmpty(),
      check('caloriesBurnt', 'Calories burnt is required').isInt({ min: 1 })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, duration, date, time, intensity, exercise, caloriesBurnt } = req.body;

    try {
      let workout = await Workout.findById(req.params.id);

      if (!workout) {
        return res.status(404).json({ msg: 'Workout not found' });
      }

      // Check if user owns the workout
      if (workout.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }

      workout = await Workout.findByIdAndUpdate(
        req.params.id,
        { $set: { name, duration, date, time, intensity, exercise, caloriesBurnt } },
        { new: true }
      );

      res.json(workout);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE /api/workouts/:id
// @desc     Delete a workout
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ msg: 'Workout not found' });
    }

    // Check if user owns the workout
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Workout.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Workout removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
