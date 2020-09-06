
const mongoose = require('mongoose');
// //define scheme

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength:3,
       
       
    },
    email: {
        type: String,
        required:true,
      
    },
    password: {
        type: String,
        required:true,
        minlength:6,
        
       
    },
}, { timestamps: true })
 const Users = mongoose.model("User", userSchema)
 module.exports = Users;
