const mongoose = require('mongoose');



const postSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    name: {
        type: String,
        required:true
       
       
    },
    description: {
        type: String,
        required:true,
      
    },
    image:{
        type:String,
        
    }
    
   
}, { timestamps: true })
 const Posts = mongoose.model("post", postSchema)
 module.exports = Posts;