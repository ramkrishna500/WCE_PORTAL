var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
mongoose.connect('mongodb://localhost:27017/usersdb',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var Schema = mongoose.Schema;

userSchema = new Schema( {
	unique_id: Number,
	email: String,
	username: String,
	rno:String,
	password: String,
	passwordConf: String,
	marks:Number,
	subjects:String,
	photo: {
        type: String,
        allowedFormats: ['jpg', 'png'],
        // transformation: [{ width 500, height: 500, crop: "limit" }],
        required: false,
        default: 'profile.png'

    }
}),

userSchema.plugin(passportLocalMongoose);
User=mongoose.model("User",userSchema);


module.exports =  User;