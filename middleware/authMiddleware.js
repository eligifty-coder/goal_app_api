import Jwt from "jsonwebtoken"
import User from "../models/userModel.js"
import { AuthenticateError } from "../errors/index.js"

const asyncWrapper = (fn) => {
   return async (req, res, next) => {
      try {
         await fn(req, res)
         next()
      } catch (error) {
         next(error)
      }
   }
}

const protect = asyncWrapper(async (req, res, next) => {
   const authHeader = req.headers.authorization
   if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw new AuthenticateError('Not Authorized, no token')
   }
   const token = authHeader.split(' ')[1]
   if (!token) {
      throw new AuthenticateError('Not Authorized, no token')
   }
   const decoded = Jwt.verify(token, process.env.JWT_SECRET)
   // verifying token with jwt
   req.user = await User.findById(decoded.id).select('-password')

})
export default protect