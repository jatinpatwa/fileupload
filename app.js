var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var mkdirp = require('mkdirp');
// var XML = require('pixl-xml');
var xml2js = require('xml2js');
var nodemailer = require('nodemailer');


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
   res.sendFile(path.join(__dirname, 'views/index.html'));
});


// var doc = null;
// try {
// 	doc = XML.parse(__dirname, '/uploads/test.xml', {preserveAttributes: true});
// }
// catch (err) {
// 	console.log("XML Parser Error: " + err);
// }
// console.log(doc);



var parser = new xml2js.Parser();
fs.readFile(__dirname + '/uploads/test.xml', function(err, data) {
  var parsed = parser.parseString(data, function (err, result) {
      console.dir(result);
      console.log('Done');
      var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        service: 'gmail',
        auth: {
          user: 'coffinskull137@gmail.com',
          pass: 'dwijatin'
        }
      });

      var mailOptions = {
        from: 'coffinskull137@gmail.com',
        to: 'jatinpatwa401@gmail.com',
        subject: 'Sending Email using Node.js',
        // alternatives: result
        text: 'Sent from NodeMailer'
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

  });
});








app.post('/upload:userName', function(req, res){

  var ip = req.connection.remoteAddress
  var username = req.params.userName
  console.log(ip)

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
    fs.rename(file.path, path.join(form.uploadDir, ip + '_' + file.name));
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
