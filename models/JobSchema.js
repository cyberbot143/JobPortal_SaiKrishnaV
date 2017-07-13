

var mongoose  = require('mongoose');
var JobSchema = mongoose.Schema({           //create a job schema
    jobTitle:{type:String},
    jobDesc:{type:String},
    jobLoc:{type:String},
    jobKeywords:{type:[String]}
});

var JobModel = mongoose.model("JobModel",JobSchema);
module.exports = JobModel;