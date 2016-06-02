var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var router = express.Router();
var User = mongoose.model('User');
var jwt = require('express-jwt');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req,res,next){
	if(!req.body.username || !req.body.password || !req.body.email || !req.body.mobile || !req.body.address || !req.body.fname){
		return res.status(400).json({message: 'Please fill out all fields'});
	}

	var user = new User();

	user.username  =req.body.username;
  user.fname = req.body.fname;
  user.mobile = req.body.mobile;
  user.email = req.body.email;
  user.address = req.body.address;

	user.setPassword(req.body.password)

	user.save(function(err){
		if(err){return next(err); }

		return res.json({token: user.generateJWT()})
	});

});


router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

router.get('/profile/:username', function(req,res){
  User.findOne({username: req.params.username},{_id: 0, username: 1, mobile: 1, email: 1, address:1, fname:1}, function(err, userdetail){
    if(err){
      throw err;
    }
    res.json(userdetail);
  });
});

module.exports = router;
