import Jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'
import User from '../models/userModel.js'
import { BadRequestError , AuthenticateError} from "../errors/index.js"
const asyncWrapper = (fn) => {
   return async (req, res, next) => {
      try {
         await fn(req, res)
      } catch (error) {
         next(error)
      }
   }
}
export const registerUser = asyncWrapper(async (req, res) => {
   const {name, email, password} = req.body
   if (!name || !email || !password) {
      throw new BadRequestError('Please add all fields')
   }
   // checking if user exist
   const userExists = await User.findOne({ email })
   if (userExists) {
      throw new AuthenticateError('User already exists')
   }
   // hashing password
   const salt =  await bcrypt.genSalt(10)
   const hashedPassword = await bcrypt.hash(password, salt)
   // creating user
   const userData = {
      name,
      email,
      password:hashedPassword,
   }
   const user = await User.create(userData)

   if (user) {
      res.status(201).json({
         _id: user.id,
         name: user.name,
         email: user.email,
         token: generateToken(user.id),
      })
   } else {
      throw new AuthenticateError('Invalid user data')
   }

   res.json({ message: 'registerd' })
})
export const loginUser = asyncWrapper(async (req, res) => {
   const { email, password } = req.body
   const user = await User.findOne({ email })
   if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
         _id: user.id,
         name: user.name,
         email: user.email,
         token:generateToken(user.id)
      })
   } else {
      throw new AuthenticateError('Invalid credentials')
   }

})

// function generationg jwt token
const generateToken = (id) => {
   return Jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
   })
}


export const getMe = asyncWrapper(async (req, res) => {
   const { id, name, email, } = await User.findOne({_id: req.user.id
})
   res.status(200).json({id, name, email})
})
