const errorHandler = (err, res, req, next) => {
   const statusCode = err.statusCode || 500
   res.status(statusCode)
   const message = err.message || 'Internal Server Error'
   res.status(statusCode).json({
      message,
      stack:process.env.NODE_ENV==='production'? null :err.stack
   })
}
export default errorHandler