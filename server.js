/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var express = require('express');
var app  = express();
var mongoose  = require('mongoose');
var bodyParser = require('body-parser');
var http = require('http');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/blogpost");

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

var JobSchema = mongoose.Schema({           //create a job schema
    jobTitle:{type:String,required:true},
    jobDesc:{type:String,required:true},
    jobLoc:{type:String,required:true},
    jobKeywords:{type:String,require:true}
});

var UserModel = mongoose.model("UserModel",UserSchema);
var JobModel = mongoose.model("JobModel",JobSchema);

app.use(express.static('public')); //static page content
app.use(bodyParser.urlencoded({'extended':false}));
app.use(bodyParser.json());

app.get('/',function(req,res){
res.sendFile(__dirname+'/index.html');
});

//register a user
app.post('/register',function(req,res){
    var retuser = req.body; 
var user = new UserModel({_id:retuser.username});
user.save(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Successfully inserted');
  }
});    
});

//start our app
app.listen(3000);	
console.log('Magic happens on port 3000' ); 