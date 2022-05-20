import mongoose from "mongoose";
const goalSchema = mongoose.Schema({
   text: {
      type: String,
      reuired:[true, 'Please add a text value']
   }
},
   {
      timestamps: true
   }
)
const Goals = mongoose.model("Goals", goalSchema)
export default Goals