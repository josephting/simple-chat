const app = require('express')()
const server = require('http').createServer(app)
const {Server} = require('socket.io')
const io = new Server(server)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', socket => {
  console.log('a user connected')
  io.emit('chat message', '[Server] a user connected')

  socket.on('chat message', msg => {
    if (msg.match(/^\/nickname (.*)$/)) {
      socket.nickname = /^\/nickname (.*)$/.exec(msg)[1]
    }
    console.log('message: ' + msg)
    if (typeof socket.nickname !== 'undefined') {
      msg = socket.nickname + ': ' + msg
    }
    io.emit('chat message', msg)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
    io.emit('chat message', '[Server] user disconnected')
  })
})

server.listen(4000, () => {
  console.log('The server is running: http://localhost:4000')
})
