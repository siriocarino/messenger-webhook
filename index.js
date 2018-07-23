const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000
const app = express();

app.use(bodyParser.json()); // creates express http server
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) => res.render('./index'))
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))


// respond with "hello world" when a GET request is made to the homepage
app.get('/webhook', function(req, res) {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "270680"

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

       // Checks the mode and token sent is correct
       if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

       } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
       }
  }else {
    res.status(200).send("PAGE"+1);
  }



});
// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {

  let body = req.body;
  console.log(body)

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

       // Iterates over each entry - there may be multiple if batched
       body.entry.forEach(function (entry) {

            // Gets the message. entry.messaging is an array, but 
            // will only ever contain one message, so we get index 0
            let webhook_event = entry.messaging[0];

            console.log(webhook_event);
            JSON.stringify(webhook_event);
            console.log(webhook_event);
            console.log("webhook_event.npl.entities");

            console.log(webhook_event.npl.entities);

       });

       // Returns a '200 OK' response to all requests
       res.status(200).send('EVENT_RECEIVED');
  } else {
 
  }


// Your verify token. Should be a random string.
let VERIFY_TOKEN = "270680"

// Parse the query params
let mode = req.query['hub.mode'];
let token = req.query['hub.verify_token'];
let challenge = req.query['hub.challenge'];

// Checks if a token and mode is in the query string of the request
if (mode && token) {

     // Checks the mode and token sent is correct
     if (mode === 'subscribe' && token === VERIFY_TOKEN) {

          // Responds with the challenge token from the request
          console.log('WEBHOOK_VERIFIED');
          res.status(200).send(challenge);

     } else {
          // Responds with '403 Forbidden' if verify tokens do not match
          res.sendStatus(403);
     }
}

});