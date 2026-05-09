const express = require('express')
const workoutsController = require('../controllers/workouts')
const { isSignedIn, isWorkoutOwner } = require('../middleware/auth')

const router = express.Router()

router.get('/', isSignedIn, workoutsController.index)
router.get('/new', isSignedIn, workoutsController.newWorkout)
router.post('/', isSignedIn, workoutsController.create)
router.get('/:workoutId', isSignedIn, workoutsController.show)
router.get('/:workoutId/edit', isSignedIn, isWorkoutOwner, workoutsController.edit)
router.put('/:workoutId', isSignedIn, isWorkoutOwner, workoutsController.update)
router.delete('/:workoutId', isSignedIn, isWorkoutOwner, workoutsController.deleteWorkout)

module.exports = router
