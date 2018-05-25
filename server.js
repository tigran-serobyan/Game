var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var ip = require('ip');
console.log(ip.address());

var messages = [];
var count = 0;
var stoneArr = [];
var stone_count = 28;
var goldArr = [];
var gold_count = 12;
var powerArr = [];
var power_count = 6;
var matrix = [];
for (var y = 0; y < 19; y++) {
    matrix[y * 32] = [];
    for (var x = 0; x < 22; x++) {
        matrix[y * 32][x * 32] = 0;
    }
}
for (var i = 0; i < stone_count; i++) {
    var x = (Math.floor(Math.random() * 18) + 2) * 32;
    var y = (Math.floor(Math.random() * 15) + 2) * 32;
    while (matrix[y][x] == 1) {
        var x = (Math.floor(Math.random() * 18) + 2) * 32;
        var y = (Math.floor(Math.random() * 15) + 2) * 32;
    }
    matrix[y][x] = 1;
    stoneArr[i] = { 'x': x, 'y': y };
}
for (var i = 0; i < gold_count; i++) {
    var x = (Math.floor(Math.random() * 18) + 2) * 32;
    var y = (Math.floor(Math.random() * 15) + 2) * 32;
    while (matrix[y][x] == 1) {
        var x = (Math.floor(Math.random() * 18) + 2) * 32;
        var y = (Math.floor(Math.random() * 15) + 2) * 32;
    }
    matrix[y][x] = 1;
    goldArr[i] = { 'x': x, 'y': y };
}
for (var i = 0; i < power_count; i++) {
    var x = (Math.floor(Math.random() * 18) + 2) * 32;
    var y = (Math.floor(Math.random() * 15) + 2) * 32;
    while (matrix[y][x] == 1) {
        var x = (Math.floor(Math.random() * 18) + 2) * 32;
        var y = (Math.floor(Math.random() * 15) + 2) * 32;
    }
    matrix[y][x] = 1;
    powerArr[i] = { 'x': x, 'y': y };
}

app.use(express.static("."));
app.get('/', function (req, res) {
    res.redirect('index.html');
});
server.listen(3000);
io.on('connection', function (socket) {
    io.sockets.emit("delete messages");
    for (var i in messages) {
        io.sockets.emit("display message", messages[i]);
    }
    io.sockets.emit("you", count);
    count++;
    if (count >= 4) {
        io.sockets.emit("start", [stoneArr, goldArr, powerArr]);
    }
    socket.on("send message", function (data) {
        messages.push(data);
        io.sockets.emit("display message", data);
    })
    socket.on('left', function (me) { io.sockets.emit('left', me) });
    socket.on('right', function (me) { io.sockets.emit('right', me) });
    socket.on('up', function (me) { io.sockets.emit('up', me) });
    socket.on('down', function (me) { io.sockets.emit('down', me) });
    socket.on('gold', function (i) {
        var x = (Math.floor(Math.random() * 20) + 1) * 32;
        var y = (Math.floor(Math.random() * 17) + 1) * 32;
        while (matrix[y][x] == 1) {
            var x = (Math.floor(Math.random() * 20) + 1) * 32;
            var y = (Math.floor(Math.random() * 17) + 1) * 32;
        }
        matrix[y][x] = 1;
        goldArr[i] = { 'x': x, 'y': y }; io.sockets.emit("start", [stoneArr, goldArr, powerArr]);
    });
    socket.on('power', function (i) { powerArr.splice(i, 1); io.sockets.emit("start", [stoneArr, goldArr, powerArr]); });
    socket.on('info', function (info) { io.sockets.emit('info', info) });
    socket.on('gold_?', function (gold_) { io.sockets.emit('gold_', gold_) });
});
