var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
// var JSON = require('json');

app.use(function (req, res, next) {
  console.log('middleware');
  req.testing = 'testing';
  return next();
});

// app.post('/subscriptions', function(req, res, next){
//   console.log('post.subscriptions', req.testing);
//   res.end();
// });

app.ws('/subscriptions', function(ws, req) {
  ws.on('paymentCardAdded', function(msg) {
    console.log('>>> paymentCardAdded', msg);
  });
  console.log('socket', req.testing);
});
var subscriptions = expressWs.getWss('/subscriptions');
app.listen(5000);

setInterval(function () {
  console.log('broadcasting');
  subscriptions.clients.forEach(function (client) {
    var id = '' + new Date();
    var payload = {paymentCardAdded: { id: id, connected: true }};
    var message = {id: id, type: 'data', payload: payload};
    console.log('sending message to client', message);
    client.send(JSON.stringify(message));
  });
}, 2000);
