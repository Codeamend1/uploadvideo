var express = require('express')
var app = express()
var port = 5000
var http = require('http');
var fs = require('fs');

var multer  = require('multer')
 
app.get('/', function (req, res, next) {
    fs.readFile('form.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
})
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
    filename:function(req,file,cb){
        cb(null,file.originalname.toLowerCase());
    }
})
 
var upload = multer({ storage: storage })

app.post('/upload', upload.single('video'), function (req, res, next) {
   console.log('Video File: '+ req.file.originalname.toLowerCase());
  try {
    res.send(req.file);
  }catch(err) {
    res.send(400);
  }
})

app.listen(port, () => console.log(`Video Upload Form at http://localhost:${port}`))