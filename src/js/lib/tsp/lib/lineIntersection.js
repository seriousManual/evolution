function getLineLineCollision(p0, p1, p2, p3) {
    var s10_x = p1.getX() - p0.getX();
    var s10_y = p1.getY() - p0.getY();
    var s32_x = p3.getX() - p2.getX();
    var s32_y = p3.getY() - p2.getY();

    var denom = s10_x * s32_y - s32_x * s10_y;

    if (denom == 0) {
        return false;
    }

    var denom_positive = denom > 0;

    var s02_x = p0.getX() - p2.getX();
    var s02_y = p0.getY() - p2.getY();

    var s_numer = s10_x * s02_y - s10_y * s02_x;

    if ((s_numer < 0) == denom_positive) {
        return false;
    }

    var t_numer = s32_x * s02_y - s32_y * s02_x;

    if ((t_numer < 0) == denom_positive) {
        return false;
    }

    return !((s_numer > denom) == denom_positive || (t_numer > denom) == denom_positive);
}

module.exports = getLineLineCollision;