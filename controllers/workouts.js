const Workout = require('../models/workout')

const index = async (req, res) => {
  const workouts = await Workout.find({ owner: req.session.user._id }).sort({ workoutDate: -1 })
  res.render('workouts/index', { workouts })
}

const newWorkout = (req, res) => {
  res.render('workouts/new')
}

const create = async (req, res) => {
  await Workout.create({
    title: req.body.title,
    workoutDate: req.body.workoutDate,
    duration: req.body.duration,
    focus: req.body.focus,
    intensity: req.body.intensity,
    notes: req.body.notes,
    owner: req.session.user._id,
  })

  res.redirect('/workouts')
}

const show = async (req, res) => {
  const workout = await Workout.findById(req.params.workoutId).populate('owner')

  if (!workout) {
    return res.status(404).render('not-found')
  }

  res.render('workouts/show', { workout })
}

const edit = (req, res) => {
  res.render('workouts/edit', { workout: req.workout })
}

const update = async (req, res) => {
  await Workout.findByIdAndUpdate(req.params.workoutId, {
    title: req.body.title,
    workoutDate: req.body.workoutDate,
    duration: req.body.duration,
    focus: req.body.focus,
    intensity: req.body.intensity,
    notes: req.body.notes,
  })

  res.redirect(`/workouts/${req.params.workoutId}`)
}

const deleteWorkout = async (req, res) => {
  await Workout.findByIdAndDelete(req.params.workoutId)
  res.redirect('/workouts')
}

module.exports = {
  index,
  newWorkout,
  create,
  show,
  edit,
  update,
  deleteWorkout,
}
