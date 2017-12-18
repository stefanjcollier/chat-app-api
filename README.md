# chat-app-api

A very simple NodeJS app that provides initial chat data and WebSocket support.

## Installation

After cloning the repo and entering the folder, run the following command to
install dependencies:

```bash
npm install
```

## Startup

The following command will start the app on **http://localhost:8888**

```bash
npm start
```

## Usage 

### Human-facing endpoints

Log in as user `joe` (you should do this for the user you want before visiting
the React app – it sets a cookie so that all subsequent requests are from that
user):

* Visit <http://localhost:8888/login/joe> in your browser.

See the currently logged in user:

* Visit <http://localhost:8888/> in your browser.

### Machine-facing endpoints

Get the list of chats for the currently logged in user:

```javascript
// GET /chats

{
  "chats": [
    {
      "buddy": "stefan",
      "lastMessage": "Hey how are you?",
      "timestamp": "2017-12-01T14:00:00.000Z"
    },
    {
      "buddy": "rewaz",
      "lastMessage": "I agree, react will take over the world one day.",
      "timestamp": "2017-12-03T01:10:00.000Z"
    }
  ]
}
```

Get the list of messages from the logged in user’s chat with `stefan`:

```javascript
// GET /chats/stefan/messages

{
  "messages": [
    {
      "body": "Hiya",
      "sender": "stefan",
      "timestamp": "2017-12-01T13:00:00.000Z"
    },
    {
      "body": "Hey how are you?",
      "sender": "joe",
      "timestamp": "2017-12-01T14:00:00.000Z"
    }
  ]
}
```

When something goes wrong:

```javascript
// GET /chats/stefaan/messages

{
  "error": "joe does not have a chat with stefaan"
}
```

## WebSocket events

Connecting to the server:

```javascript
const socket = io('http://localhost:8888')
```

Sending a new message:

```javascript
socket.emit('send', {
  body: "How are things going?",
  buddy: "stefan",  // Who you are sending the message to.
})
```

Receiving a new message:

```javascript
socket.on('receive', (message) => {
  console.log(message.body)  // => 'Not too bad thanks'
  console.log(message.sender)  // => 'joe'
  console.log(message.timestamp)  // => '2017-12-18T05:31:00.000Z'
})
```

## Debug

Something weird happening? Check the command line – it will provide info on all
requests the app received.
