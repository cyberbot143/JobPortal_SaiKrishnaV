/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var http = require('http');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/blogpost"); //connection to mongodb
var UserModel = require('./models/UserSchema');
var JobModel = require('./models/JobSchema')

app.use(express.static(__dirname + '/public')); //static page content
app.use(bodyParser.urlencoded({
  'extended': false
}));
app.use(bodyParser.json());
var router = express.Router();

// serve angular front end files from root path
router.use('/', express.static('public', {
  redirect: false
}));

// rewrite virtual urls to angular app to enable refreshing of internal pages

//register a user and assign _id as username
app.post('/reg', function (req, res) {
  var retuser = req.body;
  var user = new UserModel({
    _id: retuser.username,
    username: retuser.username,
    email: req.body.email,
    location: retuser.location,
    phone: retuser.phone,
    password: retuser.password,
    userType: retuser.userType
  });
  user.save(function (err) {
    if (err) {
      console.log(err);
      res.status(500).send({
        "message": "Error with server"
      })
    }
    if (!user) {
      console.log('user already exists');
      res.status(201).send({
        "message": "User already exists"
      });
    } else {
      res.status(200).send({
        "message": "Succesfully Registered"
      });
      console.log('Successfully inserted');
    }
  });
});

app.post('/log', function (req, res) {
  var user = req.body;
  UserModel.findOne({
    username: user.username,
    password: user.password
  }, function (err, user) {
    if (err) {
      res.status(500).send({
        msg: "error"
      });
    }
    if (user) {
      res.status(200).send({
        userData: user
      });
    } else {
      res.status(404).send({
        msg: "User not found error"
      });
    }
  })
});
app.post('/updateProfile', function(req, res) {
  var user = req.body;
   const doc = {
    email: user.user.email,
    location: user.user.location,
    phone:user.user.phone,
    password: user.user.password,
    updatedAt: Date.now(),
  };
  UserModel.update({_id:req.body.username}, doc, function(err, raw) {
    if (err) {
      res.send(err);
    }
    res.status(200).send({"msg":"successful registration"});
  })
});

app.post("/postJob",
  function (req, res) {
    var job = req.body;
    var user = new JobModel({
      jobTitle: job.title,
      jobDesc: job.desc,
      jobLoc: job.location,
      jobKeywords: job.keywords
    });
    user.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Successfully posted a job');
        res.send(200);
      }
    });
  });

app.post('/searchkey', function (req, res) {

  var key = req.body.key;

  JobModel.find({
    $or: [{
      "jobTitle": key
    }, {
      "jobDesc": key
    }, {
      "jobLoc": key
    }, {
      jobKeywords: {
        $regex: key
      }
    }]
  }, function (err, jobs) {

    if (err) {
      res.status(500).send({
        msg: "error"
      });
    }
    if (jobs) {
      console.log(jobs);
      res.status(200).send({
        jobs: jobs
      });
    } else {
      res.status(404).send({
        msg: "User error"
      });
    }
  }).collation({
    locale: 'en',
    strength: 2
  });
});

router.get('*', function (req, res, next) {
  res.sendFile(path.resolve('public/index.html'));
});
app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

//start our app
app.listen(3000);
console.log('Magic happens on port 3000');