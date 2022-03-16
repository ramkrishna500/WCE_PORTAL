var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
mongoose.connect('mongodb://localhost:27017/usersdb',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var Schema = mongoose.Schema;

teacherSchema=new Schema({
	unique_id:Number,
	email:String,
	username:String,
	password:String,
	passwordConf:String
})

teacherSchema.plugin(passportLocalMongoose);
Teacher = mongoose.model('Teacher', teacherSchema);


module.exports =  Teacher;