
const socket = io('http://localhost:9003');


socket.on('messageFromServer', (dataFromServer) => {
  console.log(dataFromServer);
  socket.emit('messageToServer', { data: "data from the Client**" })
})

socket.on('nsList', (nsData) => {
  console.log('The list of namespaces has arrived')

  let namespacesDiv = document.querySelector('.namespaces')
  namespacesDiv.innerHTML = "";
  nsData.forEach(ns => {
    namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}"</div>`
  })

  Array.from(document.getElementsByClassName('namespace')).forEach(elem => {
    elem.addEventListener('click', (e) => {
      const nsEndpoint = elem.getAttribute('ns');
      console.log(`${nsEndpoint} I should go to now`)
    })
  })

  const nsSocket = io('http://localhost:9003/wiki')
  nsSocket.on('nsRoomLoad', (nsRooms) => {
    let roomList = document.querySelector('.room-list');
    roomList.innerHTML = "";
    nsRooms.forEach(room => {
      let glyph;
      if (room.privateRoom) {
        glpyh = 'lock'
      } else {
        glpyh = 'globe'
      }
      roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glpyh}"></span>${room.roomTitle}</li>`
    })

    let roomNodes = document.getElementsByClassName('room')
    Array.from(roomNodes).forEach(elem => {
      elem.addEventListener('click', (e) => {
        console.log("Someone clicked on ", e.target.innerText)
      })
    })
  })
})

document.querySelector('#message-form').addEventListener('submit', (event) => {
  event.preventDefault();
  console.log('Form submitted');

  const newMessage = document.querySelector('#user-message').value;

  socket.emit('newMessageToServer', { text: newMessage })

})

socket.on('messageToClients', (msg) => {
  console.log(msg);
  document.querySelector('#messages').innerHTML += `<li>${msg.text}</li>`
})

