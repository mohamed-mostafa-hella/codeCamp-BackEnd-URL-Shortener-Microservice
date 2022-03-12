require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
var regexpression = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

var original_url;
var short_url = 'short_url';


app.use(cors());

app.use(bodyParser.urlencoded({extended : false}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl',(req,res)=>{
  original_url = req.body.url;
  var retJSON;
  if(req.body.url.match(regexpression)){
    retJSON = {
      original_url,
      short_url};
  }else{
    retJSON = {error: 'invalid url'};
  }
  res.json(retJSON);
  res.status(200);
})

app.get(`/api/shorturl/${short_url}`,(req,res)=>{
  res.redirect(original_url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
