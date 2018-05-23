var side = 32;
function Collision_left(PX, PY, OX, OY) {
    var playerOX = PX + (side / 2);
    var playerOY = PY + (side / 2);
    var objectOX = OX + (side / 2);
    var objectOY = OY + (side / 2);
    if (playerOX - objectOX <= side && playerOX - objectOX >= 0) {
        if (Math.abs(playerOY - objectOY) < side) {
            return true;
        }
    }
}
function Collision_right(PX, PY, OX, OY) {
    var playerOX = PX + (side / 2);
    var playerOY = PY + (side / 2);
    var objectOX = OX + (side / 2);
    var objectOY = OY + (side / 2);
    if (objectOX - playerOX <= side && objectOX - playerOX >= 0) {
        if (Math.abs(playerOY - objectOY) < side) {
            return true;
        }
    }
}
function Collision_up(PX, PY, OX, OY) {
    var playerOX = PX + (side / 2);
    var playerOY = PY + (side / 2);
    var objectOX = OX + (side / 2);
    var objectOY = OY + (side / 2);
    if (playerOY - objectOY <= side && playerOY - objectOY >= 0) {
        if (Math.abs(playerOX - objectOX) < side) {
            return true;
        }
    }
}
function Collision_down(PX, PY, OX, OY) {
    var playerOX = PX + (side / 2);
    var playerOY = PY + (side / 2);
    var objectOX = OX + (side / 2);
    var objectOY = OY + (side / 2);
    if (objectOY - playerOY <= side && objectOY - playerOY >= 0) {
        if (Math.abs(playerOX - objectOX) < side) {
            return true;
        }
    }
}