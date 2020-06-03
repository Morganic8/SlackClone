const express = require('express');
const app = express();
//Server class
const socketio = require('socket.io');

let namespaces = require('./data/namespaces');

app.use(express.static(__dirname + '/public'))

//Express server listening on port
const expressServer = app.listen(9003);

//socketio listening to express server
// can invoke server methods
const io = socketio(expressServer);

//socketio emits event to client, receives event from client
io.on('connection', (socket) => {
  let nsData = namespaces.map(ns => {
    return {
      img: ns.img,
      endpoint: ns.endpoint
    }
  })

  socket.emit('nsList', nsData);
})


namespaces.forEach(namespace => {
  io.of(namespace.endpoint).on('connection', (nsSocket) => {
    console.log(`${nsSocket.id} has joined ${namespace.endpoint}`)

    nsSocket.emit('nsRoomLoad', namespaces[0].rooms)
  })
})
