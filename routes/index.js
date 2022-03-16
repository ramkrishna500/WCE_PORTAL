var express = require('express');
const { redirect } = require('express/lib/response');
var router = express.Router();
// var md5=require("md5");
var bcrypt=require('bcryptjs');
var User = require('../models/user');
var Teacher=require("../models/teacher");

var credential = {
    email : "admin@gmail.com",
    password : "admin123",
	name: "Admin"
}

router.get('/', function (req, res, next) {
	return res.render('home.ejs');
});
router.get('/student-home', function (req, res, next) {
	return res.render('student-home.ejs');
});
router.get('/register', function (req, res, next) {
	return res.render('register.ejs');
});
router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});
router.get('/secrets', function (req, res, next) {
	return res.render('secrets.ejs');
});

router.get('/faculty-home', function (req, res, next) {
	return res.render('faculty-home.ejs');
});
router.get('/faculty-register', function (req, res, next) {
	return res.render('faculty-register.ejs');
});
router.get('/faculty-login', function (req, res, next) {
	return res.render('faculty-login.ejs');
});

router.get('/admin-login', function (req, res, next) {
	return res.render('admin-login.ejs');
});
router.get('/adminDashBoard', function (req, res, next) {
	return res.render('adminDashBoard.ejs');
});
router.get("/student",function(req,res){
	return res.render("student.ejs");
})
router.get("/marks",function(req,res){
	return res.render("marks.ejs");
})


router.post('/register', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body;


	if(!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf || !personInfo.rno){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({email:personInfo.email},function(err,data){
				if(!data){
					var c;
					User.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}
						var salt=bcrypt.genSaltSync(10);
						var hash = bcrypt.hashSync(req.body.password,salt);
						var newPerson = new User({
							unique_id:c,
							email:personInfo.email,
							username: personInfo.username,
							rno:personInfo.rno,
							password: hash,
							passwordConf: hash
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.render("login",{login:"You are registered,You can login now."})
				}else{
					res.render("login",{login:"Email is already used."})
				}

			});
		}else{
			res.render("register",{register:"password is not matched"})
		}
	}
});

// faculty-register form

router.post('/faculty-register', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body;


	if(!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf ){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			Teacher.findOne({email:personInfo.email},function(err,data){
				if(!data){
					var c;
					Teacher.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}
						var salt = bcrypt.genSaltSync(2);
        				var hash = bcrypt.hashSync(req.body.password,salt);
						var newPerson = new Teacher({
							unique_id:c,
							email:personInfo.email,
							username: personInfo.username,
							password: hash,
							passwordConf: hash
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.render("faculty-login",{facultylogin:"You are registered,You can login now."})
				}else{
					res.render("faculty-login",{facultylogin:"Email is already used."})
				}

			});
		}else{
			res.render("faculty-register",{facultyregister:"password is not matched"})
		}
	}
});

router.post('/login', function (req, res, next) {
	User.findOne({email:req.body.email},function(err,data){
		if(data){
			// var pas1=
			if(bcrypt.compareSync(req.body.password, data.password)){
				req.session.userId = data.unique_id;
				res.render('student', {"name":data.username, "PRN":data.rno, "email":data.email,login:"Success!"});
			}else{
				res.render("login",{login:"Wrong password!"})
			}
		}else{
			res.render("login",{login:"This Email Is not registered!"})
		}
	});
});

// admin Login

router.post('/admin-login', function (req, res, next) {
	if(req.body.email === credential.email && req.body.password === credential.password){
        req.session.user = req.body.email;
		// redirect("/views/adminDashBoard.ejs")
        res.render('adminDashBoard',{"name":credential.name, "email":credential.email,login:"Success!"})
        //res.end("Login Successful...!");
    }else{
        res.render("admin-login",{login:"Invalid"});
    }
});


// login for faculty

router.post('/faculty-login', function (req, res, next) {
	//console.log(req.body);
	Teacher.findOne({email:req.body.email},function(err,data){
		if(data){
			if(bcrypt.compareSync(req.body.password, data.password)){
				//console.log("Done Login");
				req.session.userId = data.unique_id;

				res.render('secrets', {"name":data.username,"email":data.email,login:"Success!"});
			}else{
				res.render("faculty-login",{login:"Wrong password!"})
			}
		}else{
			res.render("faculty-login",{login:"This Email Is not registered!"})
		}
	});
});

router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});

module.exports = router;