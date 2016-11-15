var express= require('express');

var app = express();

app.set('port', process.env.PORT || 3000);

app.get('/', function(request,response){
  response.send('Express works');
});

app.listen(app.get('port'), function(){
  console.log('Express listening on port 3000');
});
