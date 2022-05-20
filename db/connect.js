import mongoose from "mongoose";
const connectDB =async (url) => {
   return mongoose.connect(url, {
      useNewUrlParser: true,
      // useUnifiedTopology: true, // for mongo 3.6 for mongo 4.0 useUnifiedTopology: true automatically, you don't have to add it
      // useCreateIndex: true,// for mongo 3.6 // useCreateIndex: true automatically, you don't have to add it
      // useFindAndModify: false,// for mongo 3.6 // useFindAndModify: false automatically, you don't have to add it
   })
}
export default connectDB