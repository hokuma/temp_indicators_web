var Aws = require('aws-sdk');
var express = require('express');
var app = express();
var accessKeyId = process.env.ACCESS_KEY;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static('public'));

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/temps.json', function(req, res) {
  var dynamodb = new Aws.DynamoDB({
    region: 'ap-northeast-1',
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
  });

  var now = new Date();
  var dateStr = "" + now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();
  var param = {
    TableName: 'temp_indicators',
    Key: {
      "measured_date": {"S": dateStr}
    }
  };
  dynamodb.getItem(param, function(err, data) {
    if(err) {
      console.log(err, err.stack);
      res.status(500).send();
    } else {
      var pure_temps = data.Item.temps.L.map(function(temp) {
        return {
          "measured_at": temp.M.measured_at.S,
          "temp": temp.M.temp.N
        };
      });
      res.status(200).json(pure_temps);
    }
  })
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Started to listening at http://%s:%s', host, port);
});
