var me = -1;
var x = [0, 672, 0, 672];
var y = [0, 0, 576, 576];
var gold_ = [false, false, false, false];
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
var life = 5;
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
    fill(255);
    textSize(50);
    text('Wait ... ', 270, 300);
}
function main() {
    var username = prompt('Welcome \nEnter a usermname');
    while (username == "") {
        username = prompt("Enter a username \nIt is important");
    }
    var socket = io.connect('http://localhost:3000');
    var chatDiv = document.getElementById('chat');
    var infoDiv = document.getElementById('info');
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
        chatDiv.innerHTML = "<h3>Chat</h3>";
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
            newDraw();
        }
    });
    socket.on('left', function (you) { x[you[1]] = you[0]; });
    socket.on('right', function (you) { x[you[1]] = you[0]; });
    socket.on('up', function (you) { y[you[1]] = you[0]; });
    socket.on('down', function (you) { y[you[1]] = you[0]; });
    socket.on('info', function (info) { infoDiv.innerHTML += info; });
    socket.on('gold_', function (new_gold) { gold_ = new_gold; });
    function move() {
        life += 0.001;
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
                            life += 0.5;
                        }
                    }
                }
                for (var i in goldArr) {
                    var objectOX = goldArr[i].x + (side / 2);
                    var objectOY = goldArr[i].y + (side / 2);
                    if (playerOX - objectOX <= side && playerOX - objectOX >= 0) {
                        if (Math.abs(playerOY - objectOY) < side) {
                            if (gold_[me] != true) {
                                gold_[me] = true;
                                socket.emit('gold', i);
                                socket.emit('gold_?', gold_);
                            }
                            else {
                                left = false;
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
                            life -= 15;
                        }
                    }
                }
                if (left == true) {
                    life += 0.005;
                    x[me]--;
                    socket.emit('left', [x[me], me]);
                }
            }
        }

        if (keyIsDown(RIGHT_ARROW)) {
            if (x[me] < 672) {
                var side = 32;
                var playerOX = x[me] + (side / 2);
                var playerOY = y[me] + (side / 2);
                var right = true;
                for (var i in stoneArr) {
                    var objectOX = stoneArr[i].x + (side / 2);
                    var objectOY = stoneArr[i].y + (side / 2);
                    if (objectOX - playerOX <= side && objectOX - playerOX >= 0) {
                        if (Math.abs(playerOY - objectOY) < side) {
                            var right = false;
                            life += 0.5;
                        }
                    }
                }
                for (var i in goldArr) {
                    var objectOX = goldArr[i].x + (side / 2);
                    var objectOY = goldArr[i].y + (side / 2);
                    if (objectOX - playerOX <= side && objectOX - playerOX >= 0) {
                        if (Math.abs(playerOY - objectOY) < side) {
                            if (gold_[me] != true) {
                                gold_[me] = true;
                                socket.emit('gold', i);
                                socket.emit('gold_?', gold_);
                            }
                            else {
                                right = false;
                            }
                        }
                    }
                }
                for (var i in powerArr) {
                    var objectOX = powerArr[i].x + (side / 2);
                    var objectOY = powerArr[i].y + (side / 2);
                    if (objectOX - playerOX <= side && objectOX - playerOX >= 0) {
                        if (Math.abs(playerOY - objectOY) < side) {
                            powerArr.splice(i, 1);
                            life -= 15;
                        }
                    }
                }
                if (right == true) {
                    life += 0.005;
                    x[me]++;
                    socket.emit('right', [x[me], me]);
                }
            }
        }

        if (keyIsDown(UP_ARROW)) {
            if (y[me] > 0) {
                var side = 32;
                var playerOX = x[me] + (side / 2);
                var playerOY = y[me] + (side / 2);
                var top = true;
                for (var i in stoneArr) {
                    var objectOX = stoneArr[i].x + (side / 2);
                    var objectOY = stoneArr[i].y + (side / 2);
                    if (playerOY - objectOY <= side && playerOY - objectOY >= 0) {
                        if (Math.abs(playerOX - objectOX) < side) {
                            top = false;
                            life += 0.5;
                        }
                    }
                }
                for (var i in goldArr) {
                    var objectOX = goldArr[i].x + (side / 2);
                    var objectOY = goldArr[i].y + (side / 2);
                    if (playerOY - objectOY <= side && playerOY - objectOY >= 0) {
                        if (Math.abs(playerOX - objectOX) < side) {
                            if (gold_[me] != true) {
                                gold_[me] = true;
                                socket.emit('gold', i);
                                socket.emit('gold_?', gold_);
                            }
                            else {
                                top = false;
                            }
                        }
                    }
                }
                for (var i in powerArr) {
                    var objectOX = powerArr[i].x + (side / 2);
                    var objectOY = powerArr[i].y + (side / 2);
                    if (playerOY - objectOY <= side && playerOY - objectOY >= 0) {
                        if (Math.abs(playerOX - objectOX) < side) {
                            life -= 15;
                            socket.emit('power', i);
                        }
                    }
                }
                if (top == true) {
                    life += 0.005;
                    y[me]--;
                    socket.emit('up', [y[me], me]);
                }
            }
        }

        if (keyIsDown(DOWN_ARROW)) {
            if (y[me] < 576) {
                var side = 32;
                var playerOX = x[me] + (side / 2);
                var playerOY = y[me] + (side / 2);
                var down = true;
                for (var i in stoneArr) {
                    var objectOX = stoneArr[i].x + (side / 2);
                    var objectOY = stoneArr[i].y + (side / 2);
                    if (objectOY - playerOY <= side && objectOY - playerOY >= 0) {
                        if (Math.abs(playerOX - objectOX) < side) {
                            down = false;
                            life += 0.5;
                        }
                    }
                }
                for (var i in goldArr) {
                    var objectOX = goldArr[i].x + (side / 2);
                    var objectOY = goldArr[i].y + (side / 2);
                    if (objectOY - playerOY <= side && objectOY - playerOY >= 0) {
                        if (Math.abs(playerOX - objectOX) < side) {
                            if (gold_[me] != true) {
                                gold_[me] = true;
                                socket.emit('gold', i);
                                socket.emit('gold_?', gold_);
                            }
                            else {
                                down = false;
                            }
                        }
                    }
                }
                for (var i in powerArr) {
                    var objectOX = powerArr[i].x + (side / 2);
                    var objectOY = powerArr[i].y + (side / 2);
                    if (objectOY - playerOY <= side && objectOY - playerOY >= 0) {
                        if (Math.abs(playerOX - objectOX) < side) {
                            life -= 15;
                            socket.emit('power', i);
                        }
                    }
                }
                if (down == true) {
                    life += 0.005;
                    y[me]++;
                    socket.emit('down', [y[me], me]);
                }
            }
        }///
    }
    setInterval(move, 50);
    var q = 0;
    function newDraw() {
        draw = function () {
            if(life > 110){
                x[me] = -200;
                y[me] = -200;
                socket.emit('down', [y[me], me]);
                socket.emit('right', [x[me], me]);
            }
            q += 20;
            image(grass, 0, 0, 704, 608);
            image(img1, x[0], y[0], 32, 32);
            image(img2, x[1], y[1], 32, 32);
            image(img3, x[2], y[2], 32, 32);
            image(img4, x[3], y[3], 32, 32);
            for (var i = 0; i < 4; i++) {
                if (gold_[i] == true) {
                    image(gold, x[i] + 8, y[i] + 5, 17, 17);
                }
            }

            for (var i in stoneArr) {
                image(stone, stoneArr[i].x, stoneArr[i].y, 32, 32);
            }
            for (var i in goldArr) {
                image(gold, goldArr[i].x, goldArr[i].y, 32, 32);
            }
            for (var i in powerArr) {
                image(power, powerArr[i].x, powerArr[i].y, 32, 32);
            }
            image(black, x[me] - 1380 - (q / 100), y[me] - 1170 - (q / 100), 2816 + (q / 49), 2432 + (q / 49));
            /* rect(x-704, y-608,664,1216);
            rect(x-704, y-608,1408,568);
            rect(x+70, y-70,904,808);
            rect(x-70, y+70,904,808);*/
            if (q <= 1000) {
                fill(255);
                rect(300, 200, 200, 50);
                textSize(20);
                if (me == 0) {
                    fill(0, 0, 200);
                    text('You are BLUE', 320, 220);
                    if (q == 20) {
                        Start_Text = '<p><strong style="color:blue">Blue:</strong>' + username + "<br></p>";
                        socket.emit('info', Start_Text);
                    }
                }
                if (me == 1) {
                    fill(200, 100, 0);
                    text('You are ORANGE', 320, 220);
                    if (q == 20) {
                        Start_Text = '<p><strong style="color:orange">Orange:</strong>' + username + "<br></p>";
                        socket.emit('info', Start_Text);
                    }
                }
                if (me == 2) {
                    fill(0, 200, 0);
                    text('You are GREEN', 320, 220);
                    if (q == 20) {
                        Start_Text = '<p><strong style="color:green">Green:</strong>' + username + "<br></p>";
                        socket.emit('info', Start_Text);
                    }
                }
                if (me == 3) {
                    fill(200, 200, 0);
                    text('You are YELLOW', 320, 220);
                    if (q == 20) {
                        Start_Text = '<p><strong style="color:yellow">Yellow:</strong>' + username + "<br></p>";
                        socket.emit('info', Start_Text);
                    }
                }
            }
            if(life > 110){
                if(q != 1021){
                    var died_text = "<p><strong>"+username+"</strong>"+" died</p>"
                    socket.emit('info',died_text);
                }
                q = 1001;
                fill(255);
                textSize(40);
                text('Game over', 270, 300);
            }
        }
    }
}

window.onload = main;