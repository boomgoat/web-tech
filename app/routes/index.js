var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const Schema = mongoose.Schema;

//DB Config
const db = require('../config/keys').mongoURI;

// Connect to Mongo
mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My Bank' });
});

const AccountSchema = new mongoose.Schema({
  Title: {
    type: String,
    default: ''
  },
  AccountNo: {
    type: Number,
    default: ''
  },
  UserId: [{
    type: Schema.Types.ObjectId, ref: 'UserSchema'
  }]
});

const UserSchema = new mongoose.Schema({
  Name: {
    type: String,
    default: ''
  },
  AccountNo: [{
    type: Schema.Types.ObjectId, ref: 'Account'
  }]
});

//initiating Schema

var User = mongoose.model('User', UserSchema);
var Account = mongoose.model('Account', AccountSchema);

// creates new Account - not required, accidental

router.get('/accounts/NewAccount', (req, res, next) => {
  const newAccount = new Account({
    Title: 'Test',
    AccountNo: 1234
  });
  newAccount.save()
    .then(account => res.json(account));
});

//get accountNo - 2

router.get('/accounts/accountno', function(req, res, next){
  Account.find({},(function (error, data){
    if(error) {
      console.log(error);
    } else {
      res.send(data.AccountNo);
    }
  }));
});

//get list of accounts - 4

router.get('/accounts/', function(req, res, next){
  Account.find({},(function (error, data){
    if(error) {
      console.log(error);
    } else {
      res.send(data);
    }
  }));
});

// attempt 1 at put - 6, doesn't update account, just makes a new one. Bad attempt, user created, account not linked

router.get('/accounts/Profile/account', (req, res, next) => {
  const newUser = new User({
    Name: 'Test'
  });
  newUser.save()
    .then(user => res.json(user));
});

// attempt 2 at put - 6,  lack of knowledge of linking through id and references. Put attempt unsuccessful

router.put('accounts/profile/acccountno/:id', function (req, res, next) {
  Account.findOne(UserId,
  User.findById(UserId).then(function (user) {
    if (!user) {
      return res.sendStatus(401);
    } else {
      user.Name == 'NewName'
    }

    return user.save().then(function () {
      return res.json({user: user.toAuthJSON()});
    });
  }).catch(next));
});

router.get('/abc', function(req, res, next) {
  res.end("My App Route");
});

module.exports = router;
