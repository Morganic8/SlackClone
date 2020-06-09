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
    const username = nsSocket.handshake.query.username


    nsSocket.emit('nsRoomLoad', namespace.rooms)
    nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallback) => {
      const roomToLeave = Object.keys(nsSocket.rooms)[1];
      nsSocket.leave(roomToLeave);
      updateUsersInRoom(namespace, roomToLeave);
      nsSocket.join(roomToJoin);
      io.of(namespace.endpoint).in(roomToJoin).clients((error, clients) => {

        numberOfUsersCallback(clients.length);
      })

      const nsRoom = namespace.rooms.find((room) => room.roomTitle === roomToJoin)
      nsSocket.emit('historyToCatchUp', nsRoom.history)
      updateUsersInRoom(namespace, roomToJoin);



      nsSocket.on('newMessageToServer', (msg) => {
        const fullMsg = {
          text: msg.text,
          time: Date.now(),
          username: username,
          avatar: 'https://via.placeholder.com/30'
        }

        const roomTitle = Object.keys(nsSocket.rooms)[1];

        const nsRoom = namespace.rooms.find((room) => room.roomTitle === roomTitle)

        nsRoom.addMessage(fullMsg);
        io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', (fullMsg))

      })
    })
  })
})

function updateUsersInRoom(namespace, roomToJoin) {
  io.of(namespace.endpoint).in(roomToJoin).clients((error, clients) => {
    io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers', clients.length);
  })
}