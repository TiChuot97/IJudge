/**
 * Width and height of the canvas.
 * @type {number}
 */
var WIDTH = 2400, HEIGHT = 1600;

/**
 * Construct the SVG element and the layers.
 */
var SVG = d3.select("#editor").append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    .attr("border", 1);

SVG.append("marker").attr("id", "arrow").attr("orient", "auto").attr("overflow", "visible")
    .append("path").attr("d", "M 5 0 L 0 3 L 0 -3 Z").attr("fill", "black");

/**
 * Initialize all the layers.
 */
var LAYER_LOWEST = SVG.append("g");
var LAYER_LOWER = SVG.append("g");
var LAYER_HIGHER = SVG.append("g");
var LAYER_HIGHEST = SVG.append("g");
var LAYER_BORDER = SVG.append("g");

/**
 * Aliases of the layers.
 */
var LAYER_EDGES = LAYER_LOWER;
var LAYER_NODES = LAYER_HIGHER;
var LAYER_UI = LAYER_HIGHEST;

/**
 * Render the border of the canvas.
 * @type {*[]}
 */
var xx = [0, 0, WIDTH, WIDTH], yy = [0, HEIGHT, HEIGHT, 0];
for (var i = 0; i < 4; ++i) {
    var j = i == 3 ? 0 : i + 1;
    LAYER_BORDER.append("line").attr("x1", xx[i]).attr("y1", yy[i])
        .attr("x2", xx[j]).attr("y2", yy[j]).attr("style", "stroke:rgb(0,0,0)");
}

/**
 * Hit box at the lowest level. Used to detect context menu event.
 */
var LOWEST_HITBOX = LAYER_LOWEST.append("rect")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    .attr("style", "fill: white");

