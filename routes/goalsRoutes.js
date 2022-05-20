import express from 'express'
import {getAllGoals, createGoal, deleteGoal, updateGoal} from '../controllers/goalsConroller.js'
const router = express.Router()
router.route('/').get(getAllGoals).post(createGoal)
router.route('/:id').put(updateGoal).delete(deleteGoal)

export default router