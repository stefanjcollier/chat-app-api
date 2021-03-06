const _ = require('lodash')
const cookie = require('cookie')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const http = require('http')
const express = require('express')
const morgan = require('morgan')
const socketIo = require('socket.io')

const app = express()
const server = http.Server(app)
const io = socketIo(server)

app.use(morgan('[:date] :method :url => :status (:response-time ms)'))
app.use(cors({
  credentials: true,
  origin: (o, cb) => cb(null, true)
}))
app.use(cookieParser())

app.locals.chats = require('./data/chats.json')
app.locals.messages = require('./data/messages.json')

// Log in as a particular user.
app.get('/login/:user', (req, res) => {
  res.cookie('user', req.params.user)
  res.send(`Logged in as ${req.params.user}`)
})

// Get the list of chats for the logged in user.
app.get('/chats', (req, res) => {
  const chatList = []
  const userChats = app.locals.chats.filter((chat) => chat.users.includes(req.cookies.user))

  userChats.forEach((chat) => {
    const chatMessages = app.locals.messages.filter((message) => message.chat_id === chat.id)

    const lastMessage = _.chain(chatMessages)
      .sortBy((message) => message.timestamp)
      .last().value()

    const buddy = _.chain(chat.users)
      .filter((user) => user !== req.cookies.user)
      .first().value()

    chatList.push({
      buddy,
      lastMessage: lastMessage.body,
      timestamp: lastMessage.timestamp
    })
  })

  res.json({ chats: chatList })
})

// Get the list of messages in one of the logged in user's chats.
app.get('/chats/:buddy/messages', (req, res) => {
  const buddy = req.params.buddy
  const user = req.cookies.user
  const messageList = []

  const chat = _.chain(app.locals.chats)
    .filter((c) => user !== buddy && (c.users.includes(buddy) && c.users.includes(user)))
    .first().value()

  if (!chat) {
    return res.status(404).json({
      error: `${req.cookies.user} does not have a chat with ${req.params.buddy}`
    })
  }

  const messages = app.locals.messages.filter((message) => message.chat_id === chat.id)

  messages.forEach((message) => {
    messageList.push({
      body: message.body,
      sender: message.sender,
      timestamp: message.timestamp
    })
  })

  res.json({ messages: messageList })
})

// Get the currently logged in user.
app.get('/', (req, res) => {
  res.send(`Current user is ${req.cookies.user}`)
})

// When a user connects, add them to 'their' room.
io.on('connection', (socket) => {
  const user = cookie.parse(socket.request.headers.cookie).user
  socket.join(user)

  // When the user sends a message, store it and send it to their buddy.
  socket.on('send', (message) => {
    const timestamp = (new Date()).toJSON()

    const chat = _.chain(app.locals.chats)
      .filter((c) => c.users.includes(message.buddy) && c.users.includes(user))
      .first().value()

    if (!chat) {
      // Trying to message buddy they don't have a chat with. Do nothing.
      return
    }

    // Save the message for future page loads.
    app.locals.messages.push({
      body: message.body,
      chat_id: chat.id,
      sender: user,
      timestamp
    })

    // Push the message to the buddy (if they're connected).
    io.to(message.buddy).emit('receive', {
      body: message.body,
      sender: user,
      timestamp
    })
  })
})

server.listen(8888, function () {
  console.log('Chat server running on http://localhost:8888')
})
