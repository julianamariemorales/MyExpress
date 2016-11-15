var express = require('express');
var app = express();

// Block the header from containing information about the server
app.disable('x-powered-by');

// Set up Handlebars
// CONTAINS:  home.handlebars, about.handlebars,404.handlebars and 500.handlebars
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Required when using POST to parse encoded data
// npm install --save body-parser
//app.use(require('body-parser').urlencoded({extended: true}));

// Formidable is required to accept file uploads
// npm install --save formidable
//var formidable = require('formidable');

// Import credentials which are used for secure cookies
// Install the cookie middleware
// npm install --save cookie-parser
//var credentials = require('./credentials.js');
//app.use(require('cookie-parser')(credentials.cookieSecret));

// Define the port to run on
app.set('port', process.env.PORT || 3000);

// Images are here
app.use(express.static(__dirname + '/public'));

// Define some routes
//home
app.get('/', function(req, res){
  res.render('home');
});

//about us
app.get('/about', function(req, res){
  res.render('about');
});


//middleware -  receives a request
app.use(function(req, res, next){
  console.log('Looking for URL : ' + req.url);
  next();
});


//report and throw errors
app.get('/junk', function(req, res, next){
  console.log('Tried to access /junk');
  throw new Error('/junk does\'t exist');
});

// Catches the error and logs it and then continues
// down the pipeline
app.use(function(err, req, res, next){
  console.log('Error : ' + err.message);
  next();
});



/*
// Link to contact view
app.get('/contact', function(req, res){

  // CSRF tokens are generated in cookie and form data and
  // then they are verified when the user posts
  res.render('contact', { csrf: 'CSRF token here' });
});

// Sent here after the form is processed
app.get('/thankyou', function(req, res){
  res.render('thankyou');
});

// Receive the contact form data and then redirect to
// thankyou.handlebars
// contact.handlebars calls process to process the form
app.post('/process', function(req, res){
  console.log('Form : ' + req.query.form);
  console.log('CSRF token : ' + req.body._csrf);
  console.log('Email : ' + req.body.email);
  console.log('Question : ' + req.body.ques);
  res.redirect(303, '/thankyou');
});

// Open file-upload.handlebars and store the current year
// and month. When the form is submitted the year and month
// will be passed
app.get('/file-upload', function(req, res){
  var now = new Date();
  res.render('file-upload',{
    year: now.getFullYear(),
    month: now.getMonth() });
  });

// file-upload.handlebars contains the form that calls here
app.post('/file-upload/:year/:month',
  function(req, res){

    // Parse a file that was uploaded
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, file){
      if(err)
        return res.redirect(303, '/error');
      console.log('Received File');

      // Output file information
      console.log(file);
      res.redirect( 303, '/thankyou');
  });
});

// Demonstrate how to set a cookie
app.get('/cookie', function(req, res){

  // Set the key and value as well as expiration
  res.cookie('username', 'DerekBanas', {expire : new Date() + 9999}).send('username has the value of : DerekBanas');
});

// Show stored cookies in the console
app.get('/listcookies', function(req, res){
  console.log("Cookies : ", req.cookies);
  res.send('Look in console for cookies');
});

// Delete a cookie
app.get('/deletecookie', function(req, res){
  res.clearCookie('username');
  res.send('username Cookie Deleted');
});

// Storing session information can be done in a few ways.
// For development we can work with a memory store
// Stores the session id in a cookie and the session data
// on the server
// npm install --save express-session

var session = require('express-session');

// parseurl provides info on the url of a request object
// npm install --save parseurl
var parseurl = require('parseurl');

app.use(session({
  // Only save back to the session store if a change was made
  resave: false,

  // Doesn't store data if a session is new and hasn't been
  // modified
  saveUninitialized: true,

  // The secret string used to sign the session id cookie
  secret: credentials.cookieSecret,
}));

// This is another example of middleware.
app.use(function(req, res, next){
  var views = req.session.views;

  // If no views initialize an empty array
  if(!views){
    views = req.session.views = {};
  }

  // Get the current path
  var pathname = parseurl(req).pathname;

  // Increment the value in the array using the path as the key
  views[pathname] = (views[pathname] || 0) + 1;

  next();

});

// When this page is accessed get the correct value from
// the views array
app.get('/viewcount', function(req, res, next){
  res.send('You viewed this page ' + req.session.views['/viewcount'] + ' times ');
});

// Reading and writing to the file system
// Import the File System module : npm install --save fs
var fs = require("fs");

app.get('/readfile', function(req, res, next){

  // Read the file provided and either return the contents
  // in data or an err
  fs.readFile('./public/randomfile.txt', function (err, data) {
   if (err) {
       return console.error(err);
   }
   res.send("The File : " + data.toString());
  });

});

// This writes and then reads from a file
app.get('/writefile', function(req, res, next){

  // If the file doesn't exist it is created and then you add
  // the text provided in the 2nd parameter
  fs.writeFile('./public/randomfile2.txt',
    'More random text', function (err) {
   if (err) {
       return console.error(err);
    }
  });

    // Read the file like before
   fs.readFile('./public/randomfile2.txt', function (err, data) {
   if (err) {
       return console.error(err);
   }

   res.send("The File : " + data.toString());
  });

});

*/

//the error pages 404 and 500
app.use(function(req, res) {
  res.type('text/html');
  res.status(404); //default status is 200
  res.render('404');
});

// Custom 500 Page
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate');
});
