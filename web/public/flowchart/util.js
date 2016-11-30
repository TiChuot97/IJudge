/**
 * Mathematical constants.
 * @type {number}
 */
var PI = Math.PI;
var PI_2 = PI / 2.0;
var PI2 = Math.PI * 2.0;

/**
 * Helper function that tests whether the given value if undefined or null;
 * @param x the value to test
 * @returns {boolean}
 */
function invalid(x) {
    return x === undefined || x === null;
}

/**
 * Move the current element to the front.
 * Source: https://github.com/wbkd/d3-extended
 * @returns {*}
 */
d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
        this.parentNode.appendChild(this);
    });
};

/**
 * Make a counter that starts from the given number.
 * @param n the starting number
 * @returns {Function}
 */
function makeCounter(n) {
    if (invalid(n)) n = 0;
    return function () {
        return n++;
    }
}
var newId = makeCounter(0);

/**
 * Compute the d parameter for a path in the given steps.
 * @param x1 the x coordinate of the first point
 * @param y1 the y coordinate of the first point
 * @param x2 the x coordinate of the second point
 * @param y2 the y coordinate of the second point
 * @param x distance in between two markers
 * @returns {string}
 */
function pathLinspace(x1, y1, x2, y2, x) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var d = Math.sqrt(dx * dx + dy * dy);
    var r = ["M", x1, y1];
    if (d > 1e-6) {
        var vx = dx * x / d;
        var vy = dy * x / d;
        var n = d / x;
        for (var i = 1; i < n; ++i) {
            r.push("L");
            r.push(x1 + vx * i);
            r.push(y1 + vy * i);
        }
    }
    return r.join(" ");
}

/**
 * Helper function that normalizes the input angle to [0, 2*PI).
 * @param a
 * @returns {number|*}
 */
function angle(a) {
    a = a % (2.0 * Math.PI);
    if (a < 0.0) a += 2.0 * Math.PI;
    return a;
}

/**
 * Add a scalar to a vector and return a new copy (does not affect the original array).
 * @param v the vector
 * @param x the scalar to add
 * @returns {string|ArrayBuffer|Blob|Array.<T>|*}
 */
function vectorAddScalar(v, x) {
    v = v.slice(0);
    for (var i = 0, n = v.length; i < n; ++i)
        v[i] += x;
    return v;
}

/**
 * Test if the two given floating point numbers are equal (within a certain relative or absolute error).
 * @param x the first number
 * @param y the second number
 * @param eps error allowed
 * @returns {boolean}
 */
function floatEq(x, y, eps) {
    if (invalid(eps)) eps = 1e-6;
    return Math.abs(x - y) / (Math.max(1.0, Math.min(Math.abs(x), Math.abs(y)))) < eps;
}

/**
 * Test if the first number is greater than or equal to the second number.
 * @param x the first number
 * @param y the second number
 * @param eps error allowed
 * @returns {boolean}
 */
function floatGeq(x, y, eps) {
    if (invalid(eps)) eps = 1e-6;
    return x > y || floatEq(x, y, eps);
}

/**
 * Test if the first number is less than or equal to the second number.
 * @param x the first number
 * @param y the second number
 * @param eps error allowed
 * @returns {boolean}
 */
function floatLeq(x, y, eps) {
    if (invalid(eps)) eps = 1e-6;
    return x < y || floatEq(x, y, eps);
}

/**
 * Make a function that calculates the intersection of the given polygon and line x sin(a) - y cos(a) = 0
 * @param x an array of the x coordinates
 * @param y an array of the y coordinates
 * @returns {Function}
 */
function makePolygonBorder(x, y) {
    var n = x.length;
    return function (a) {
        a = angle(-a);
        var s = Math.sin(a);
        var c = Math.cos(a);
        for (var i = 0; i < n; ++i) {
            var x1 = x[i], x2 = x[(i + 1)%n];
            var y1 = y[i], y2 = y[(i + 1)%n];
            var b = Math.atan2(y2 - y1, x2 - x1);
            var ss = Math.sin(b);
            var cc = Math.cos(b);
            var f = (cc * y1 - ss * x1) / (cc * s - c * ss);
            var rx = f * c, ry = f * s;
            var d = angle(Math.atan2(ry, rx) - a);
            d = Math.min(d, PI2 - d);
            if (floatGeq(rx, Math.min(x1, x2)) && floatLeq(rx, Math.max(x1, x2)) &&
                floatGeq(ry, Math.min(y1, y2)) && floatLeq(ry, Math.max(y1, y2)) &&
                floatEq(d, 0.0)) {
                var rr = [rx, ry];
                return rr;
            }
        }
        return [-100, -100];
    };
}
