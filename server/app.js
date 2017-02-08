var express = require('express')
var path = require('path')
var app = express()
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var UserDataModel = require('./mongo/model')
var mongoose = require('mongoose')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)

var bcrypt = require('bcryptjs')
var SALT_WORK_FACTOR = 10

var dbUrl = 'mongodb://localhost:27017/test'
var db = mongoose.connect(dbUrl)
db.connection.on("error", function (error) {
    console.log("database connection failed£º" + error)
})
db.connection.on("open", function () {
    console.log("------ database connection succeed£¡------")
})

app.use(bodyParser.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(session({
  secret: 'mertens', 
  cookie: {
    maxAge: 60 * 1000 * 30, 
    httpOnly: false
  },
  store: new MongoStore({
    url: dbUrl,
    touchAfter: 30 * 60
  })
}))


app.get('/getUserName', function (req, res) {
  if (req.session.isLogin) {
    res.send({
      code: 0,
      userName: req.session.userInfo.userName
    })
  } else {
    res.send({
      code: -1,
      msg: 'please login£¡'
    })
  }
})

app.get('/getUserQnData', function (req, res) {
  if (req.session.isLogin) {
    UserDataModel.findOne(
      { email: req.session.userInfo.userEmail },
      { qnData: 1, _id: 0 },
      function (err, userData) {
        if (err) {
          console.log(err)
          res.send(err)
        }
        if (userData === null) {
          res.send({
            code: -1,
            msg: 'No documents found!'
          })
        }
        else {
          if (!!req.query.qnId) {
            for (var i = 0; i < userData.qnData.length; i++) {
              if (userData.qnData[i].qnId === req.query.qnId) {
                res.send({
                  code: 1,
                  msg: `userData'qnId is ${req.query.qnId}`,
                  data: userData.qnData[i]
                })
                break
              }
            }
          }
          else {
            res.send({
              code: 0,
              msg: 'OK',
              data: userData.qnData
            })
          }
        }
      })
  }
  else {
    res.send({
      code: -2,
      msg: 'Please Login!'
    })
  }
})

app.post('/deleteUserQn', function (req, res) {
  if (req.session.isLogin) {
    if (req.body.qnList) {
      var qnList = JSON.parse(req.body.qnList)
      var len = qnList.length
      var qnDeleted = 0
      qnList.forEach(function (qnId) {
        UserDataModel.update(
          { email: req.session.userInfo.userEmail },
          { $pull : { "qnData": { "qnId": qnId } } },
          function (err) {
            if (err) {
              res.send({
                code: -1,
                msg: 'questionnaire ' + qnId + ' deletion failed£¡'
              })
              return console.log(qnId + 'questionnaire deletion failed')
            }
            qnDeleted++
            if (qnDeleted === len) {
              res.send({
                code: 0,
                msg: 'deletion succeed£¡'
              })
            }
          })
      })
    }
    if (req.body.qnId) {
      var qnId = req.body.qnId
      UserDataModel.update(
        { email: req.session.userInfo.userEmail },
        { $pull : { "qnData": { "qnId": qnId } } },
        function (err) {
          if (err) {
            res.send({
              code: -1,
              msg: 'questionnaire ' + qnId + ' deletion failed£¡'
            })
            return console.log(qnId + 'questionnaire deletion failed')
          }
          res.send({
            code: 1,
            msg: 'deletion succeed£¡'
          })
        })
    }
  }
})

app.post('/updateUserQnData', function (req, res) {
  if (req.session.isLogin) {
    var crtQnData = JSON.parse(req.body.qnData)
    var editMode = req.body.editMode
    if (editMode === 'modify') {
      UserDataModel.update(
        { email: req.session.userInfo.userEmail },
        { $pull : { "qnData": { "qnId": crtQnData.qnId } } },
        function (err) {
          if (err) return console.log('questionnaire ' + qnId + ' deletion failed')
        })
      UserDataModel.update(
        { email: req.session.userInfo.userEmail },
        { $push: { qnData: crtQnData } },
        function (err) {
          if (err) {
            res.send({
              code: -3,
              msg: 'questionnaire edition failed'
            })
            return console.log('questionnaire edition failed£º', err)
          }
          res.send({
            code: 1,
            msg: 'questionnaire edition succeed'
          })
          console.log('questionnaire edition succeed')
        })
    } else {
      UserDataModel.update(
        { email: req.session.userInfo.userEmail },
        { $push: { qnData: crtQnData } },
        function (err) {
          if (err) {
            res.send({
              code: -2,
              msg: 'add questionnaire failed'
            })
            return console.log('add questionnaire failed', err)
          }
          res.send({
            code: 0,
            msg: 'add questionnaire succeed'
          })
          console.log('add questionnaire succeed')
        })
    }
  } else {
    res.send({
      code: -1,
      msg: 'Please Login'
    })
  }
})

app.get('/getdatabyemail', function (req, res) {
  var email = req.query.email || ''
  UserDataModel.findOne({ email: email }, { email: 1, _id: 0 }, function (err, doc) {
    if (err) {
      console.log(err)
      res.send(err)
    }
    if (doc === null) {
      res.send({
        code: -1,
        msg: 'No documents found!'
      })
    } else {
      res.send({
        code: 0,
        msg: 'The email already exists!'
      })
    }
  })
})

app.post('/signup', function (req, res) {
  var _userData = new UserDataModel({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  })
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) {
      return console.log(err)
    }
    bcrypt.hash(_userData.password, salt, function (err, hash) {
      if (err) {
        return console.log(err)
      }
      _userData.password = hash
      _userData.save(function (err, results) {
        if (err) {
          console.log(err)
          res.send({
            code: -1,
            msg: 'Something error!'
          })
        }
        req.session.isLogin = true
        req.session.userInfo = {
          userName: req.body.name,
          userEmail: req.body.email
        }
        res.send({
          code: 0,
          msg: 'The registration is successful!'
        })
        console.log('The registration is successful')
      })
    })
  })
})

app.post('/login', function (req, res) {
  var loginEmail = req.body.email2
  var loginPsd = req.body.secret
  UserDataModel.findOne({ email: loginEmail }, {
    name: 1,
    password: 1,
    email: 1
  }, function (err, userInfo) {
    if (err) {
      console.log(err)
    }
    if (!userInfo) {
      res.send({
        code: -1,
        msg: 'user not exist'
      })
      return console.log('user not exist')
    }
    userInfo.comparePassword(loginPsd, function (err, isMatch) {
      if (err) {
        console.log(err)
      }
      if (isMatch) {
        req.session.isLogin = true
        req.session.userInfo = {
          userName: userInfo.name,
          userEmail: userInfo.email
        }
        console.log(req.session)
        res.send({
          code: 0,
          msg: 'login succeed£¡'
        })
      } else {
        res.send({
          code: -2,
          msg: 'wrong password'
        })
      }
    })
  })
})

app.post('/signout', function (req, res) {
  req.session.isLogin = false
  res.send({
    code: 0,
    msg: 'singout succeed£¡'
  })
})

module.exports = app