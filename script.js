var me = -1;
var x = [0, 672, 0, 672];
var y = [0, 0, 576, 576];
var gold = true;
var img1;
var img2;
var img3;
var img4;
var grass;
var stone;
var gold;
var power;
var black;
var stoneArr = [];
var goldArr = [];
var powerArr = [];
var life = 68;
function setup() {
    createCanvas(704, 608);
    background('#acacac');
    fill(0, 0, 0);
    grass = loadImage('images/grass.png');
    img1 = loadImage('images/player_blue.png');
    img2 = loadImage('images/player_orange.png');
    img3 = loadImage('images/player_green.png');
    img4 = loadImage('images/player_yellow.png');
    stone = loadImage('images/stone.png');
    gold = loadImage('images/gold.png');
    power = loadImage('images/power.png');
    black = loadImage('images/black.png');
}
function draw() {
    fill(0);
    rect(0, 0, 704, 608);
}
function main() {
    var username = prompt('Welcome \nEnter a usermname');
    while (username == "") {
        username = prompt("Enter a username \nIt is important");
    }
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
    function start(arr) {
        stoneArr = arr[0];
        goldArr = arr[1];
        powerArr = arr[2];

    }
    socket.on('display message', handleMessage);
    socket.on('delete messages', deleteMessages);
    socket.on('start', start);
    socket.on('you', function (you) {
        if (me == -1) {
            me = you;
        }
        if (you == 3) {
            setTimeout(draw = function () {
                image(grass, 0, 0, 704, 608);

                image(img1, x[0], y[0], 32, 32);
                image(img2, x[1], y[1], 32, 32);
                image(img3, x[2], y[2], 32, 32);
                image(img4, x[3], y[3], 32, 32);

                for (var i in stoneArr) {
                    image(stone, stoneArr[i].x, stoneArr[i].y, 32, 32);
                }
                for (var i in goldArr) {
                    image(gold, goldArr[i].x, goldArr[i].y, 32, 32);
                }
                for (var i in powerArr) {
                    image(power, powerArr[i].x, powerArr[i].y, 32, 32);
                }
                image(black, x[me] - 1380, y[me] - 1170, 2816, 2432);
                /* rect(x-704, y-608,664,1216);
                rect(x-704, y-608,1408,568);
                rect(x+70, y-70,904,808);
                rect(x-70, y+70,904,808);*/
            },3000);
        }
    });
    socket.on('left', function (you) { x[you[1]] = you[0]; });
    socket.on('right', function (you) { x[you[1]] = you[0]; });
    socket.on('up', function (you) { y[you[1]] = you[0]; });
    socket.on('down', function (you) { y[you[1]] = you[0]; });
    socket.on('gold', function (i) { goldArr.splice(i, 1); });
    function move() {
        life -= 0.001;
        document.getElementById('energy_color').style.width = life + "%";
        if (keyIsDown(LEFT_ARROW)) {
            if (x[me] > 0) {
                var side = 32;
                var playerOX = x[me] + (side / 2);
                var playerOY = y[me] + (side / 2);
                var left = true;
                for (var i in stoneArr) {
                    var objectOX = stoneArr[i].x + (side / 2);
                    var objectOY = stoneArr[i].y + (side / 2);
                    if (playerOX - objectOX <= side && playerOX - objectOX >= 0) {
                        if (Math.abs(playerOY - objectOY) < side) {
                            var left = false;
                            life -= 0.5;
                        }
                    }
                }
                for (var i in goldArr) {
                    var objectOX = goldArr[i].x + (side / 2);
                    var objectOY = goldArr[i].y + (side / 2);
                    if (playerOX - objectOX <= side && playerOX - objectOX >= 0) {
                        if (Math.abs(playerOY - objectOY) < side) {
                            if (gold != true) {
                                gold = true;
                                socket.emit('gold', i);
                            }
                        }
                    }
                }
                for (var i in powerArr) {
                    var objectOX = powerArr[i].x + (side / 2);
                    var objectOY = powerArr[i].y + (side / 2);
                    if (playerOX - objectOX <= side && playerOX - objectOX >= 0) {
                        if (Math.abs(playerOY - objectOY) < side) {
                            powerArr.splice(i, 1);
                            life += 10;
                        }
                    }
                }
                if (left == true) {
                    life -= 0.005;
                    x[me]--;
                    socket.emit('left', [x[me], me]);
                }
            }
        }

        if (keyIsDown(RIGHT_ARROW)) {
            if (x[me] < 672) {
                life -= 0.005;
                x[me]++;
                socket.emit('right', [x[me], me]);
            }
        }

        if (keyIsDown(UP_ARROW)) {
            if (y[me] > 0) {
                life -= 0.005;
                y[me]--;
                socket.emit('up', [y[me], me]);
            }
        }

        if (keyIsDown(DOWN_ARROW)) {
            if (y[me] < 576) {
                life -= 0.005;
                y[me]++;
                socket.emit('down', [y[me], me]);
            }
        }
    }
    setInterval(move, 50);
}

window.onload = main;