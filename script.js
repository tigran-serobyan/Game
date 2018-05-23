var me = -1;
var x = [64, 608, 64, 608];
var y = [64, 64, 502, 502];
var gold_ = [false, false, false, false];
var base_ = [
    [32, 32],
    [640, 0],
    [0, 544],
    [640, 544],
    [32, 0],
    [640, 32],
    [32, 544],
    [672, 544],
    [0, 32],
    [672, 32],
    [32, 576],
    [640, 576]
];
var img1;
var img2;
var img3;
var img4;
var grass;
var stone;
var gold;
var power;
var black;
var base;
var point;
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
    base1 = loadImage('images/camp_blue.png');
    base2 = loadImage('images/camp_orange.png');
    base3 = loadImage('images/camp_green.png');
    base4 = loadImage('images/camp_yellow.png');
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
    var socket = io();
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
                var left = true;
                for (var i in stoneArr) {
                    if (Collision_left(x[me], y[me], stoneArr[i].x, stoneArr[i].y)) {
                        left = false;
                        life += 0.5;
                    }
                }
                for (var i in goldArr) {
                    if (Collision_left(x[me], y[me], goldArr[i].x, goldArr[i].y)) {
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
                for (var i in powerArr) {
                    if (Collision_left(x[me], y[me], powerArr[i].x, powerArr[i].y)) {
                        powerArr.splice(i, 1);
                        life -= 15;
                    }
                }
                for (var i in base_) {
                    if (Collision_left(x[me], y[me], base_[i][0], base_[i][1])) {
                        var left = false;
                        if (gold_[me]) {
                            point++;
                            gold_[me] = false;
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
                var right = true;
                for (var i in stoneArr) {
                    if (Collision_right(x[me], y[me], stoneArr[i][0], stoneArr[i][1])) {
                        var right = false;
                        life += 0.5;

                    }
                }
                for (var i in goldArr) {
                    if (Collision_right(x[me], y[me], goldArr[i][0], goldArr[i][1])) {
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
                for (var i in powerArr) {
                    if (Collision_right(x[me], y[me], powerArr[i][0], powerArr[i][1])) {
                        powerArr.splice(i, 1);
                        life -= 15;
                    }
                }
                for (var i in base_) {
                    if (Collision_right(x[me], y[me], base_[i][0], base_[i][1])) {
                        var right = false;
                        if (gold_[me]) {
                            point++;
                            gold_[me] = false;
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
                var top = true;
                for (var i in stoneArr) {
                    if (Collision_up(x[me], y[me], stoneArr[i][0], stoneArr[i][1])) {
                        top = false;
                        life += 0.5;
                    }
                }
                for (var i in goldArr) {
                    if (Collision_up(x[me], y[me], goldArr[i][0], goldArr[i][1])) {
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
                for (var i in powerArr) {
                    if (Collision_up(x[me], y[me], powerArr[i][0], powerArr[i][1])) {
                        life -= 15;
                        socket.emit('power', i);
                    }
                }
                for (var i in base_) {
                    if (Collision_up(x[me], y[me], base_[i][0], base_[i][1])) {
                        var top = false;
                        if (gold_[me]) {
                            point++;
                            gold_[me] = false;
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
                var down = true;
                for (var i in stoneArr) {
                    if (Collision_down(x[me], y[me], stoneArr[i][0], stoneArr[i][1])) {
                        down = false;
                        life += 0.5;
                    }
                }
                for (var i in goldArr) {
                    if (Collision_down(x[me], y[me], goldArr[i][0], goldArr[i][1])) {
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
                for (var i in powerArr) {
                    if (Collision_down(x[me], y[me], powerArr[i][0], powerArr[i][1])) {
                        life -= 15;
                        socket.emit('power', i);
                    }
                }
            }
            for (var i in base_) {
                if (Collision_down(x[me], y[me], base_[i][0], base_[i][1])) {
                    var down = false;
                    if (gold_[me]) {
                        point++;
                        gold_[me] = false;
                    }
                }
            }
            if (down == true) {
                life += 0.005;
                y[me]++;
                socket.emit('down', [y[me], me]);
            }
        }
    }
    setInterval(move, 50);
    var q = 0;
    function newDraw() {
        draw = function () {

            if (life > 110) {
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
            image(base1, 0, 0, 64, 64);
            image(base2, 640, 0, 64, 64);
            image(base3, 0, 544, 64, 64);
            image(base4, 640, 544, 64, 64);
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
            image(black, x[me] - 1380, y[me] - 1170, 2816, 2432);
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
            if (life > 110) {
                if (q != 1021) {
                    var died_text = "<p><strong>" + username + "</strong>" + " died</p>"
                    socket.emit('info', died_text);
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