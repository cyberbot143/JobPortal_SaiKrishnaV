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
   username :{type:String,required:true},
   email:{type:String,required:true},
   location:{type:String,required:true},
   phone:{type:String,required:true},
   password:{type:String,required:true},
   userType:{type:String,required:true},
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
app.post('/regdata',function(req,res){
    console.log(req.body);
    var user = req.body;
    UserModel.create(user).then(
            function(userObj){
                res.json(200);     
            },function (error){
                res.sendStatus(400);
            });      
});

//start our app
app.listen(3000);	
console.log('Magic happens on port 3000' ); 