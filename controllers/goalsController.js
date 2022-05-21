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
   const goals  =  await Goals.find({user:req.user.id})
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
      text: req.body.text,
      user : req.user._id,
   })
   res.status(201).json(goal)
})
export const updateGoal = asyncWrapper(async (req, res) => {
   // i checked the id of the goal in the url and the id of the user in the token
   const goal = await Goals.findOne({ user: req.user._id, _id:req.params.id })
   
   const user = await User.findOne({ _id: req.user.id })
   console.log(user._id.toString())
   if (!user) {
      throw new AuthenticateError('User not found')
   }
   if (!req.body.text) {
      throw new BadRequestError('Text cannot be empty')
   }
   // [thinking out loud after debugging for a long time]_id is a mongoose objectId(so,it should always be converted to a string) while id is just a string
   if (goal.user.toString() !== user._id.toString()) {
      throw new AuthenticateError('User not Authorized')
   }
   
   const updatedGoal = await Goals.findOneAndUpdate({ id: req.params.id, user: req.user.id }, req.body, { new: true, runValidators: true })
   res.json(updatedGoal)
})

export const deleteGoal = asyncWrapper(async (req, res) => {
   const id = req.params.id
   const goal = await Goals.findOne({id, })
   if (!goal) {
      throw new NotFoundError('Goals not found')
   }
   const user = await User.findOne({ _id: req.user.id })

   if (goal.user.toString() !== user._id.toString()) {
      throw new AuthenticateError('User not Authorized')
   }
   await Goals.findOneAndRemove({id, user:req.user.id})
   res.status(200).json({id})
})
