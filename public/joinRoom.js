function joinRoom(roomName) {
    //send room name to server
    nsSocket.emit('joinRoom', roomName, (newNumberOfMembers) => {
        document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span></span>`
    })

    nsSocket.on('historyToCatchUp', (history) => {

        const messagesUL = document.querySelector('#messages');
        messagesUL.innerHTML = "";
        history.forEach((msg) => {
            const newMsg = buildHtml(msg);
            const currentMessages = messagesUL.innerHTML;
            messagesUL.innerHTML = currentMessages + newMsg;
        })
        messagesUL.scrollTo(0, messagesUL.scrollHeight);
    })

    nsSocket.on('updateMembers', (numMembers) => {
        document.querySelector('.curr-room-num-users').innerHTML = `${numMembers} <span class="glyphicon glyphicon-user"></span></span>`;
        document.querySelector('.curr-room-text').innerText = `${roomName}`;
    })

    let searchBox = document.querySelector('#search-box');
    searchBox.addEventListener('input', e => {
        let messages = Array.from(document.getElementsByClassName('message-text'))
        messages.forEach(msg => {
            if (msg.innerText.indexOf(e.target.value) === -1) {
                msg.style.display = "none";

            } else {
                msg.style.display = "block";
            }
        })
    })
}