import Goals from "../models/goalModel.js"
import User from '../models/userModel.js'
import { BadRequestError, NotFoundError , AuthenticateError} from '../errors/index.js'

const asyncWrapper = (fn) => {
   return async (req, res, next) => {
      try {
         await fn(req, res)
      } catch (error) {
         next(error)
         // res.status(error.statusCode).json({ message: error.message })
         console.log(error)
      }
   }
}



export const getAllGoals = asyncWrapper(async (req, res) => {
   console.log(req.user)
   const goals  =  await Goals.find({user:req.user.id})
   res.json(goals)
})
export const createGoal = asyncWrapper(async (req, res) => {
   const text = req.body.text
   // todo ?  i will put the line of code below in a separate file eg badRequestError.js
   if (!text) {
      throw new BadRequestError('Please add a text fields')
   }
   const goal = await Goals.create({
      text: req.body.text,
      user : req.user._id,
   })
   res.status(201).json(goal)
})
export const updateGoal = asyncWrapper(async (req, res) => {
   const goal = await Goals.findById(req.params.id)

   if (!goal) {
      res.status(400)
      throw new Error('Goal not found')
   }

   // Check for user
   if (!req.user) {
      res.status(401)
      throw new Error('User not found')
   }

   // Make sure the logged in user matches the goal user
   if (goal.user.toString() !== req.user.id) {
      res.status(401)
      throw new Error('User not authorized')
   }

   const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
   })

   res.status(200).json(updatedGoal)
})

export const deleteGoal = asyncWrapper(async (req, res) => {
   const id = req.params.id
   const goal = await Goals.findOne({id })
   if (!goal) {
      throw new NotFoundError('Goals not found')
   }
   if (!req.user) {
      throw new NotFoundError('User not found')
   }

   if (goal.user.toString() !== req.user.id) {
      throw new AuthenticateError('User not Authorized')
   }
   await Goals.findOneAndRemove({id, user:req.user.id})
   res.status(200).json({id})
})
