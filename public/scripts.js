
const username = prompt("What is your first name?");
//const socket = io('http://localhost:9003');
const socket = io('http://localhost:9003', {
  query: {
    username
  }
});
let nsSocket = "";

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

      joinNs(nsEndpoint);
    })
  })
  joinNs('/wiki')
})

