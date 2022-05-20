import  Goals from "../models/goalModel.js"
import { BadRequestError, NotFoundError } from '../errors/index.js'

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
   const goals  =  await Goals.find()
   res.json(goals)
})
export const createGoal = asyncWrapper(async (req, res) => {
   const text = req.body.text
   console.log(req.body)
   // todo ?  i will put the line of code below in a separate file eg badRequestError.js
   if (!text) {
      throw new BadRequestError('Please add a text fields')
   }
   const goal = await Goals.create({
      text: req.body.text
   })
   res.status(201).json(goal)
})
export const updateGoal = asyncWrapper(async (req, res) => {
   const goalData = req.body
   const {id} = req.params
   const goal = await Goals.findById(id)
   if (!goal) {
      throw new NotFoundError('Goals not found')
   }
   const updatedGoal = await Goals.findOneAndUpdate({ _id: id }, goalData, { new: true, runValidators: true
})
   res.status(200).json(updatedGoal)
})
export const deleteGoal = asyncWrapper(async (req, res) => {
   const id = req.params.id
   const goal = await Goals.findById(id)
   if (!goal) {
      throw new NotFoundError('Goals not found')
   }
   await Goals.findOneAndRemove({id})
   res.status(200).json({id})
})
