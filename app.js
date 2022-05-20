import express from 'express'
import  goalRoutes from './routes/goalsRoutes.js'
import dotenv from 'dotenv'
dotenv.config()
import errorHandler from './middleware/errorMiddleware.js'
const port = process.env.PORT||5000
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api/v1/goals', goalRoutes)
app.use(errorHandler)

app.listen(port, () => {
   console.log(`server started on ${port}`)
})