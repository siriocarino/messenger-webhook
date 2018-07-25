const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000
const app = express();
const request = require('request');


app.use(bodyParser.json()); // creates express http server
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) => res.render('./index'))
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

const PAGE_ACCESS_TOKEN = "EAAcXxuMKq34BANkRdEzb9w6LadZBURA5VyGtX6W4DSqDNO07sewIz2huLLm3VssUvDdncGRsUabYJSW68RrZB9UTqoneFapXbFWIxgCJwwtwKmiR44IcqAJpFodylpOcNJdqZAV9B5cCm8hTB0M6m3AiKAOY8wGRYXj3guBZBgZDZD"


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

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

       // Iterates over each entry - there may be multiple if batched
       body.entry.forEach(function (entry) {

            // Gets the message. entry.messaging is an array, but 
            // will only ever contain one message, so we get index 0
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);
          
            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
              handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
              handlePostback(sender_psid, webhook_event.postback);
            }

            
       });

       // Returns a '200 OK' response to all requests
       res.status(200).send('EVENT_RECEIVED');
  } else {
     // Return a '404 Not Found' if event is not from a page subscription
     res.sendStatus(404);
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

function handleMessage(sender_psid, received_message) {
  let response;

  // Check if the message contains text
  if (received_message.text) {

    // Create the payload for a basic text message
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an image!`
    }
  }

  // Sends the response message
 callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}

function handlePostback(sender_psid, received_postback) {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "Thanks!" }
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}