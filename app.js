/*Twit package source:

Twitter library
 https://www.npmjs.com/package/twit
 https://github.com/ttezel/twit

 Bible API
 http://www.ourmanna.com/verses/api/

 */


var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();




// ** Starting configurations

console.log('Started....');

//Requiring twit package
var Twit = require('twit');

//Made a file with all the API keys called config.js
//Requiring the information that is in the config.js
var config = require('./config');
console.log(config);

//Making a new twit object with config
var T = new Twit(config); //T is my connection to the API / twitter package

//Setting up a user stream
var stream = T.stream('user');



//Check when someone fallows me
stream.on('follow', followed);

//Function that will send a message when someone follows me
//Will handle a event for this stream

function followed(Msg){

  //json data that and object that has all the metadata associated with follow event.
  //https://dev.twitter.com/streaming/overview/messages-types
  var name = Msg.source.name;
  var screenName = Msg.source.screen_name;
  tweetIt('Hi @' + screenName + ' Thanks for following me!');
  console.log("You have a new follower  - " + screenName);

}


//Setting how often I want my bot to run  --- 1000*60*60*8);
setInterval(tweetIt, 1000*60);

var request = require('request');


var baseURL = 'http://www.ourmanna.com/verses/api/get?format=text&order=random' ;


//Function that will post on my twitter
function tweetIt(txt){

  request( {url :baseURL} , function(error, response, body){
    console.log(" ----- ");
    console.log("Next verse is: "+body );
    console.log(" ---- ");
    //console.log(response);


    /* Here I am checking if next verse has more than 140 characters. If so it will call the function tweetIt
    and search for another verse until it finds one that has less than 140 characters
     */


    if (body.length >= 140){
      //Todo -
      //var res = body.substr(0,137);
      //console.log (res + "...");
      console.log("Verse was longer than 140... Trying again");
      console.log(" ---- ");
      tweetIt();

    }else{
      console.log("Verse was sent");
    }
    var followme = {
      status: txt
    };

    var tweet = {
      status: body
    };

    T.post('statuses/update',tweet, tweeted, followme);

  });


  function tweeted(err, data, response){
    if(err){
      console.log("Something went wrong");
      console.log("ERR "+err);
    }else{
      console.log("It works");
    }
  }
}


console.log("Getting here");

//----------------------------------------------------

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
