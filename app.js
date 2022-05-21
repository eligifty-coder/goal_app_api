import express from 'express'
import goalRoutes from './routes/goalsRoutes.js'
import userRoutes from './routes/userRoutes.js'
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './db/connect.js'
import colors from 'colors'
import errorHandler from './middleware/errorMiddleware.js'
import protect from './middleware/authMiddleware.js'

const port = process.env.PORT||5000
const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api/v1/goals', protect, goalRoutes)
app.use('/api/v1/users', userRoutes)
app.use(errorHandler)

app.listen(port, async() => {
   try {
      await connectDB(process.env.MONGO_URI)
      console.log(`server started on ${port}`)
   } catch (error) {
      console.log(error)
      process.exit(1)
   }
})