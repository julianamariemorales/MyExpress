var express = require('express');
var app = express();
var fs = require('fs');
var activenavbar = require('./controllers/footer');

// Block the header from containing information about the server
app.disable('x-powered-by');

// Set up Handlebars
// CONTAINS:  home.handlebars, about.handlebars,404.handlebars and 500.handlebars
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(require('body-parser').urlencoded({extended: true}));

var formidable = require('formidable');

// Import credentials which are used for secure cookies
var credentials = require('./credentials.js');
app.use(require('cookie-parser')(credentials.cookieSecret));

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

//contact us
app.get('/contact', function(req, res){
  // verified when the user posts
  res.render('contact', { csrf: 'CSRF token here' });
});

// thankyou
//after the form is processed
app.get('/thankyou', function(req, res){
  res.render('thankyou');
});

// Receive the contact form data and then redirect to
// contact.handlebars calls process to process the form
app.post('/process', function(req, res){
  console.log('Form : ' + req.query.form);
  console.log('CSRF token : ' + req.body._csrf);
  console.log('Email : ' + req.body.email);
  console.log('Question : ' + req.body.ques);
  res.redirect(303, '/thankyou');

//append email
  fs.appendFile('contactlog.txt', (req.body.email + " - " + req.body.ques) + '\r\n', (err) => {
      if (err) throw err;
        console.log('File updated!');
        });
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


// file-upload
app.get('/file-upload', function(req, res){
  var now = new Date();
  res.render('file-upload',{
    year: now.getFullYear(),
    month: now.getMonth() });
  });


//savefile
//app.use(express.body-parser({uploadDir:'/public/uploadedimages'}));

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


//set a cookie
app.get('/cookie', function(req, res){

  // Set the key and value as well as expiration
  res.cookie('username', 'julianamariemorales', {expire : new Date() + 9999}).send('username has the value of : julianamariemorales');
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



// Storing session information
var session = require('express-session');

//info on the url of a request object
var parseurl = require('parseurl');

app.use(session({
  //save back to the session store if a change was made
  resave: false,

  // Doesn't store data if a session is new and hasn't been modified
  saveUninitialized: true,

  // The secret string used to sign the session id cookie
  secret: credentials.cookieSecret,
}));

//middleware again
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
  next(); //continue to the pipeline
});


// When this page is accessed get the correct value from the views array
app.get('/viewcount', function(req, res, next){
  res.send('You viewed this page ' + req.session.views['/viewcount'] + ' times ');
});


app.get('/readfile', function(req, res, next){

  // Read the file provided and either return the content in data or an err
  fs.readFile('./public/randomfile.txt', function (err, data) {
   if (err) {
       return console.error(err);
   }
   res.send("The File : " + data.toString());
  });

});

//for admin: display the contactlog
app.get('/contactlog', function(req, res, next){

    // Read the file like before
   fs.readFile('./contactlog.txt', function (err, data) {
   if (err) {
       return console.error(err);
   }

   res.send("The Contact Log: " + data.toString());
  });

});



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
