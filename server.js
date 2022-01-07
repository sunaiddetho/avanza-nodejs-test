var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var port = process.env.PORT || 8001,
    ip   = process.env.IP   || '0.0.0.0';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, ip, function () {
  console.log('Echo API is listening on port ' + port );
});

app.get('/', (req, res) => {
  res.send('<h1 style="color:green;">Hello World!</h1> \n');
});

app.post('/post-test', (req, res) => {
    console.log('Got body:', req.body);
    res.sendStatus(200);
});

var reqData = function(req) {
  const params = ['method', 'hostname', 'path', 'query', 'headers', 'body']
  return params.reduce(
    (accumulator, currentValue) => { accumulator[currentValue] = req[currentValue]; return accumulator},
    {}
  );
};

app.all('*', function (req, res) {
  res.set('Content-Type', 'application/json');
  res.set("Access-Control-Allow-Origin", "*");
  var response = reqData(req);
  res.status(200).send(JSON.stringify(response,null,2));
});
