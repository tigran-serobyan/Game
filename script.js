function main() {
    var username = prompt('Welcome \nEnter a usermname');
    var socket = io.connect('http://localhost:3000');
    var chatDiv = document.getElementById('chat');
    var input = document.getElementById('message');
    var button = document.getElementById('submit');

    function handleSubmit(evt) {
        var val = input.value;
        if (val != "") {
            val = "<b>" + username + "</b>:" + val;
            socket.emit("send message", val);
        }
    }
    button.onclick = handleSubmit;
    function handleMessage(msg) {
        var p = document.createElement('p');
        p.innerHTML = msg;
        chatDiv.appendChild(p);
        input.value = "";
    }
    function deleteMessages() {
        chatDiv.innerHTML = "";
    }

    socket.on('display message', handleMessage);
    socket.on('delete messages', deleteMessages);
} // main closing bracket

window.onload = main;