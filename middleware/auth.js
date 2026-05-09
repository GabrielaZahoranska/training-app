const Workout = require('../models/workout')

const isSignedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/sign-in')
  }
  next()
}

const isWorkoutOwner = async (req, res, next) => {
  const workout = await Workout.findById(req.params.workoutId)

  if (!workout) {
    return res.status(404).render('not-found')
  }

  if (workout.owner.toString() !== req.session.user._id) {
    return res.redirect('/workouts')
  }

  req.workout = workout
  next()
}

module.exports = {
  isSignedIn,
  isWorkoutOwner,
}
