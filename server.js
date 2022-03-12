require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
var regexpression = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

var original_url;
var short_url;


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

// hashing function convert string to an integer 
function hashStr (str){
    var hash = 0;
    for(var i = 0 ; i < str.length ; i++){
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
}

app.post('/api/shorturl',(req,res)=>{
  original_url = req.body.url;
  short_url = hashStr(original_url);
  console.log(short_url);
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

// test URLs value
app.get('/api/test',(req,res)=>{
  res.json({
    original_url,
      short_url
  });
  res.status(200);
});

// make short url dynamic
app.get('/api/shorturl/:url',(req,res)=>{
  if(req.params.url == short_url)
    res.redirect(original_url);
  else
    {
      res.json({"error" : `404 error bage is not found blease check your route. you might want short bath route it is ${short_url}`})
      res.status(404);
    }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
