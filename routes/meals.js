const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Meal = require('../models/Meal');
const router = express.Router();

// @route    POST /api/meals
// @desc     Create a meal
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('calories', 'Calories is required').isInt({ min: 1 }),
      check('date', 'Date is required').isISO8601(),
      check('time', 'Time is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, calories, date, time } = req.body;

    try {
      const newMeal = new Meal({
        name,
        calories,
        date,
        time,
        user: req.user.id
      });

      const meal = await newMeal.save();
      res.json(meal);
    } catch (err) {
      console.error('Error creating meal:', err.message);
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  }
);

// @route    GET /api/meals
// @desc     Get all meals
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const meals = await Meal.find({ user: req.user.id }).sort({ date: -1 });
    res.json(meals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT /api/meals/:id
// @desc     Update a meal
// @access   Private
router.put(
  '/:id',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('calories', 'Calories is required').isInt({ min: 1 }),
      check('date', 'Date is required').isISO8601(),
      check('time', 'Time is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, calories, date, time } = req.body;

    try {
      let meal = await Meal.findById(req.params.id);

      if (!meal) {
        return res.status(404).json({ msg: 'Meal not found' });
      }

      // Check if user owns the meal
      if (meal.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }

      meal = await Meal.findByIdAndUpdate(
        req.params.id,
        { $set: { name, calories, date, time } },
        { new: true }
      );

      res.json(meal);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE /api/meals/:id
// @desc     Delete a meal
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({ msg: 'Meal not found' });
    }

    // Check if user owns the meal
    if (meal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Meal.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Meal removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
