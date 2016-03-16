var express=require('express');
var router=express.Router();
var path=require('path');
var bodyPaser=require('body-parser');
router.use(bodyPaser.json())
var http = require('http');
var mongojs=require('mongojs');

var session = require('express-session');
router.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));
var db = mongojs('mongodb://arun:123@ds023398.mlab.com:23398/heroku_461p1j1s', ['register']);

 var sess="";

//Check User Exist in db-Starts
router.post('/checkUserExist',function(req,res){
	console.log("auth server");
	console.log(req.body);
	db.register.find(req.body,function(err,docs){
		console.log(docs);
		if (docs.length>0) {
			res.json({'msg':'User Already Exist!','vcolor':'red','CStatus':true});
		}else{
			res.json({'msg':'Available!','vcolor':'green','CStatus':false});
		}

	});
});
//Check User Exist in db-Ends



//Check checkLoginUser in db-Starts
router.post('/checkLoginUser',function(req,res){
	db.register.find(req.body,function(err,docs){
		console.log(docs);
		res.json(docs);
	});
});
//Check checkLoginUser in db-Ends

//Login Starts
router.post('/login',function(req,res){
console.log(req.body);
db.register.find(req.body,function(err,docs){
	if (docs.length>0) {
		if (docs[0].email==req.body.email && docs[0].password==req.body.password) {
			if (docs[0].verified=='1') {
				req.session.email=req.body.email;
				req.session.password=req.body.password;
				res.json({'Result':'true'});
			}else{
				res.json({'Result':'false'});
			}
		
	}else{
		res.json({'Result':'false'});
	}
	}else{
		res.json({'Result':'false'});
	}	
	
});
});
//Login Ends


//Register-Insert Starts
router.post('/register',function(req,res){
console.log(req.body._id);
db.register.insert(req.body,function(err,docs){
	res.json(docs);
});
});
//Register-Insert Ends


//Mail Starts
router.get('/mail',function(req,res){
	console.log(req.query.activationlink);
	var  nodemailer = require('nodemailer'); 
var transporter=nodemailer.createTransport({     
	service:'gmail',
	auth:{
		user:'frugaltalent@gmail.com',
		pass:'Welcome@123#'
	} 
});
transporter.sendMail({
	from:'frugaltalent@gmail.com',
	to:req.query.emailID,
	subject:'Frugal Lms Activation Link',
	html:"<p>Welcome to Lms!</p><p style='font-weight:bold;'>Activation link:</p>"+req.query.activationlink})
res.redirect('/#/');
})
//Mail Ends


//Confirm Starts
router.get('/confirm/:token',function(req,res){
console.log("Token::" + mongojs.ObjectId(req.params.token));
var event_id=mongojs.ObjectId(req.params.token);
db.register.find({"_id": event_id},function(err,docs){
	console.log("docs.verified"+JSON.stringify(docs[0]));
	console.log(docs.length);
	if (docs.length>0) {
		if (docs[0].verified==0) {

			db.register.update({"_id" :event_id	}, {$set: {verified:"1"}},function(err,udocs){
		console.log(udocs);
			

				var  nodemailer = require('nodemailer');
				var transporter=nodemailer.createTransport({     
					service:'gmail',
					auth:{
						user:'frugaltalent@gmail.com',
						pass:'Welcome@123#'
					} 
				});
				transporter.sendMail({
					from:'frugaltalent@gmail.com',
					to:docs[0].email,
					subject:'Frugal Lms Activation Link',
					html:"<p>Welcome to Lms!</p><p style='font-weight:bold;'>UserName:</p>"+docs[0].email+"<p style='font-weight:bold;'>Password:</p>"+docs[0].password})
				res.redirect('/#/activations');

				})
		}else{
			 // res.sendfile(__dirname+'/public/verified.html');
			 res.redirect('/#/activationp');
		}
		
	}
})
})
//Confirm Ends





//Forget Password Starts
router.post('/forgetpassword',function(req,res){
console.log("ddoc"+JSON.stringify(req.body));
db.register.update({"email" : req.body.email}, {$set: {ResetPassStr:req.body.ResetString}},function(err,udocs){
		console.log("ddoc"+JSON.stringify(udocs));
if (udocs) {
	var  nodemailer = require('nodemailer');
				var transporter=nodemailer.createTransport({     
					service:'gmail',
					auth:{
						user:'frugaltalent@gmail.com',
						pass:'Welcome@123#'
					} 
				});
				transporter.sendMail({
					from:'frugaltalent@gmail.com',
					to:req.body.email,
					subject:'Frugal Lms Password Reset Link',
					html:"<p>Welcome to Lms!</p><p style='font-weight:bold;'>Password Reset link:</p><p>http://frugal-lms2.herokuapp.com/reset/"+req.body.ResetString+"</p>"})
	res.redirect('/#/recoverpassword');
				
}
res.json(udocs[0]);

	});

})

//Forget Password Ends


//Reset Password Starts

router.get('/reset/:token',function(req,res){
console.log(req.params.token);
db.register.find({"ResetPassStr" : req.params.token},function(err,docs){
	// console.log("docs.verified"+JSON.stringify(docs[0]));
	console.log(docs.length);
	if (docs.length>0) {
		console.log("docs[0].verified"+docs[0].verified);
		if (docs[0].verified==1) {
			sess=req.session;
			sess.resetPass= docs[0].ResetPassStr;

			res.redirect('/#/recoverpassword');
		}else{
			console.log("Your EmailID is not Verified Still.Please Verify it!");
		}
		
	}else{
		console.log("Wrong Reset Password Link!");
	}
})
})

//Reset Password Ends
//Reset Pass starts

router.post('/recoverpassword',function(req,res){
	console.log("recoverpassword");
console.log(req.body);
sess=req.session;

console.log("get global"+sess.resetPass);
if (sess.resetPass) {
	db.register.update({"ResetPassStr" : sess.resetPass}, {$set: {password:req.body.password,ResetPassStr:''}},function(err,udocs){
		console.log(udocs);
		
		sess.resetPass="";
		res.json(udocs);

	});
}else
{
	console.log("Reset Password Link Session Expired");
}

});
//Reset Pass Ends





router.post('/loginverified',function(req,res){
	console.log("loginverified");
console.log(req.body);

	db.register.update({"email" : req.body.email}, {$set: {loginverified:"1"}},function(err,udocs){
		console.log(udocs);

	});

});

module.exports=router;
