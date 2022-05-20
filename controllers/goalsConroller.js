const asyncWrapper = (fn) => {
   return async (req, res) => {
      try {
         await fn(req, res)
      } catch (error) {
         res.status(404).json({ message: error.message })
         console.log(error)
      }
   }
}
export const getAllGoals = asyncWrapper(async (req, res) => {
   res.send('get all resources')
})
export const createGoal = asyncWrapper(async (req, res) => {
   if(req.bo)
   res.send('create resource')
})
export const updateGoal = asyncWrapper(async (req, res) => {
   res.send('update aresource')
})
export const deleteGoal = asyncWrapper(async (req, res) => {
   res.send('delete aresource')
})
