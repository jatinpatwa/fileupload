var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var mkdirp = require('mkdirp');


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
   res.sendFile(path.join(__dirname, 'views/index.html'));
});



app.post('/upload:userName', function(req, res){


  var username = req.params.userName
  if (!fs.existsSync(path.join(__dirname, '/uploads/'+username))){
    mkdirp(path.join(__dirname, '/uploads/'+username), function (err) {
      if (err) console.error(err)
      else console.log(username)
    });
  }
  else console.log('Folder already exists, upload successful');
  // console.log(username)



  var form = new formidable.IncomingForm();


  form.multiples = true;

  form.uploadDir = path.join(__dirname, '/uploads/'+username);

  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

 form.on('field', function(field, userName) {
 console.log(userName);
});





  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });


  form.on('end', function() {

    res.end('success');
  });

  form.parse(req);

});

 var server = app.listen(3000, function(){
 console.log('Server listening on port 3000');
});