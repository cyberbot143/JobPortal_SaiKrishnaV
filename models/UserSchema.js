
var mongoose  = require('mongoose');
var UserSchema = mongoose.Schema({         //creating a post schema
   _id: {type:String},
   username:{type:String},
   email:{type:String},
   location:{type:String},
   phone:{type:String},
   password:{type:String},
   userType:{type:String},
   regOn:{type:Date,default:Date.now}
});

var UserModel = mongoose.model("UserModel",UserSchema);
module.exports = UserModel;