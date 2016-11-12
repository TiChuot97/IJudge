/**
 * Construct the SVG element and the layers.
 */
var SVG = d3.select("body").append("svg")
    .attr("width", 800)
    .attr("height", 800)
    .attr("border", 1);

SVG.append("marker").attr("id", "arrow").attr("orient", "auto").attr("overflow", "visible")
    .append("path").attr("d", "M 5 0 L 0 3 L 0 -3 Z").attr("fill", "black");

var LAYER_LOWEST = SVG.append("g");
var LAYER_LOWER = SVG.append("g");
var LAYER_HIGHER = SVG.append("g");
var LAYER_HIGHEST = SVG.append("g");
var LAYER_BORDER = SVG.append("g");
var LAYER_UI = LAYER_HIGHEST;

var xx = [0, 0, 800, 800], yy = [0, 800, 800, 0];
for (var i = 0; i < 4; ++i) {
    var j = i == 3 ? 0 : i + 1;
    LAYER_BORDER.append("line").attr("x1", xx[i]).attr("y1", yy[i])
        .attr("x2", xx[j]).attr("y2", yy[j]).attr("style", "stroke:rgb(0,0,0)");
}

/**
 * Constructor a counter that starts from the given number.
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
 * Hit box at the lowest level. Used to detect context menu event.
 */
LAYER_LOWEST.append("rect")
    .attr("width", 800)
    .attr("height", 800)
    .attr("style", "fill: white");

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
 * Global variables that stores the user's selection of nodes.
 */
var LinkFirst = null, LinkSecond = null, LinkType = null;

/**
 * Remove a link.
 * @param p the link to remove
 */
function removeLink(p) {
    var d = p.data()[0];
    delete d.src.data()[0].links[d.id];
    delete d.dst.data()[0].links[d.id];
    p.remove();
}

/**
 * Update the given link, recomputing the start and end point.
 * @param p the link to update
 */
function updateLink(p) {
    var d = p.data()[0];
    var u = d.src.data()[0], v = d.dst.data()[0];
    var x1 = u.x + u.ox + u.width/2, y1 = u.y + u.oy + u.height/2;
    var x2 = v.x + v.ox + v.width/2, y2 = v.y + v.oy + v.height/2;
    p.select("path").attr("d", pathLinspace(x1, y1, x2, y2, 15));
    p.select("line").attr("x1", x1).attr("x2", x2)
	.attr("y1", y1).attr("y2", y2);
    if (d.lbl)
	p.select("foreignObject")
	.attr("x", (x1 + x2) * .5 - 30.)
	.attr("y", (y1 + y2) * .5 - 13);
}

/**
 * Create a new link that goes from the first node to the second node.
 * @param a the first node
 * @param b the second node
 * @param type whether the link is a dependency or a pipe
 */
function link(a, b, type) {
    var u = a.data()[0], v = b.data()[0], id = newId();
    var d = { src: a, dst: b, id: id, lbl: false };
    var p = LAYER_LOWER.append("g").data([d]);
    var x = p.append("path").attr("marker-mid", "url(#arrow)");
    if (type == 1) x.attr("stroke", "black").attr("stroke-width", 1);
    var y = p.append("line").attr("stroke", "transparent").attr("stroke-width", 20);
    u.links[id] = v.links[id] = p;

    updateLink(p);

    y.on("contextmenu", function (d, i) {
	d3.event.preventDefault();
	var v = [];
	if (d.lbl)
	    v.push(["Remove Label", function () {
		p.select("foreignObject").remove();
		d.lbl = false;
	    }]);
	else
	    v.push(["Label", function () {
		d.lbl = true;
		p.append("foreignObject").attr("width", 100).attr("height", 30)
		    .html("<input size=\"5\" type=\"text\" style=\"text-align: center;\">");
		updateLink(p);
	    }]);
	v.push(["Delete", function () {
	    removeLink(p);
	}]);
	contextMenu(d3.event.x, d3.event.y, v);
    });
}

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
 * Create a new node at the given location.
 * @param x the x coordinate
 * @param y the y coordinate
 * @param args optional arguments
 */
function node(x, y, args) {
    /**
     * Assign default values.
     */
    if (invalid(args)) args = {};
    var def = [
	["layer", LAYER_HIGHER],
	["style", 0],
	["shadow", true], ["shadowX", 2], ["shadowY", 3], ["shadowAlpha", 0.3],
	["shadowAlpha", 0.3], ["shadowFill", "rgb(100, 100, 100)"],
	["width", 250], ["height", 180], ["rx", 0], ["ry", 0],
	["fill", "rgb(255, 255, 255)"], ["border", true],
	["borderFill", "rgb(222, 222, 222)"], ["borderWidth", 1],
	["content", ""]
    ];
    for (var i in def)
	if (invalid(args[def[i][0]]))
	    args[def[i][0]] = def[i][1];
    if (args.style == 2 && invalid(args.spikeWidth))
	args.spikeWidth = Math.min(args.width / 4, 30);
    if (invalid(args.contentX))
	args.contentX = args.style == 0 ? Math.min(15, args.width/8) :
        args.style == 1 ? args.width / 5 : 15 + args.spikeWidth / 2;
    if (invalid(args.contentY))
	args.contentY = args.style == 0 ? Math.min(15, args.width/8) :
        args.style == 1 ? args.height / 5 : 15;

    /**
     * Create a group for this node and initialize its data.
     */
    var all = args.layer.append("g");
    all.data([{x: 0, y: 0, ox: x, oy: y, width: args.width, height: args.height,
	       links: {}, id: newId()}]);

    /**
     * Helper function that creates the specified shape (args.style) at the given location.
     * There are three options available: rectangles (could be rounded), ellipses and hexagons.
     * @param x the x coordinate
     * @param y the y coordinate
     * @param r where to append this shape
     * @returns {*}
     */
    var shape = function (x, y, r) {
	if (invalid(r)) r = all;
	if (args.style == 0)
	    return r.append("rect")
	    .attr("x", x)
	    .attr("y", y)
	    .attr("width", args.width)
	    .attr("height", args.height)
	    .attr("rx", args.rx)
	    .attr("ry", args.ry);
	else if (args.style == 1)
	    return r.append("ellipse")
	    .attr("rx", args.width / 2)
	    .attr("ry", args.height / 2)
	    .attr("cx", x + args.width / 2)
	    .attr("cy", y + args.height / 2);
	else if (args.style == 2)
	    return r.append("path")
	    .attr("d", [
		"M", x + args.spikeWidth, y,
		"L", x + args.width - args.spikeWidth, y,
		"L", x + args.width, y + args.height / 2,
		"L", x + args.width - args.spikeWidth, y + args.height,
		"L", x + args.spikeWidth, y + args.height,
		"L", x, y + args.height / 2,
		"Z"
	    ].join(" "));
    };

    /**
     * Create the shadow.
     */
    if (args.shadow) {
	var shadow = shape(x + args.shadowX, y + args.shadowY)
	    .attr("style", "fill: " + args.shadowFill +
		  "; opacity: " + args.shadowAlpha);
    }

    /**
     * Create the colored block.
     */
    var borderStyle = args.border ? ("; stroke: " + args.borderFill +
				     "; stroke-width: " + args.borderWidth) : "";
    var selectStyle = "; stroke-dasharray: 5,5; stroke: red; stroke-width: " + args.borderWidth * 2;
    var box = shape(x, y)
	.attr("style", "fill: " + args.fill + borderStyle);

    /**
     * Create the content of the node.
     */
    var content = all.append("foreignObject")
	.attr("width", args.width - args.contentX * 2)
	.attr("height", args.height - args.contentY * 2)
	.attr("x", x + args.contentX)
	.attr("y", y + args.contentY)
	.html(args.content);

    /**
     * Drag event handler. When the user drags this node, move it to the new location
     *     and updates all the edges (links) connected, while also bringing this node to the front.
     */
    box.call(d3.drag().on("drag", function (d) {
	var s = "translate(" + (d.x += d3.event.dx) + ", " + (d.y += d3.event.dy) + ")";
	box.attr("transform", s);
	if (args.shadow) shadow.attr("transform", s);
	content.attr("transform", s);
	all.moveToFront();

	for (var i in all.data()[0].links)
	    updateLink(all.data()[0].links[i])
    }));

    /**
     * Contextmenu event handler. When the user right clicks the background of the node,
     *     display a menu of options to manipulate this node.
     */
    box.on("contextmenu", function () {
	d3.event.preventDefault();
	contextMenu(d3.event.x, d3.event.y, [
	    ["Dependency", function () {
		LinkFirst = all;
		LinkType = 0;
	    }],
	    ["Pipe", function () {
		LinkFirst = all;
		LinkType = 1;
	    }],
	    ["Delete", function () {
		for (var i in all.data()[0].links)
		    removeLink(all.data()[0].links[i]);

		all.remove();
	    }]]);
    });

    /**
     * Click event handler. When the user left clicks this node, bring it to the front.
     *     If this is the second node of a new link, create the link and set the variables back to null.
     */
    all.on("click", function () {
	d3.select(this).moveToFront();
	if (LinkFirst != null) {
	    if (LinkFirst != all) {
		link(LinkFirst, all, LinkType);
	    }
	    LinkFirst = null;
	    LinkSecond = null;
	}
    });

    /**
     * Mouseover event handler. When the pointer hovers above this node, turn the border into dashed red lines.
     */
    all.on("mouseover", function () {
	box.attr("style", "fill: " + args.fill + selectStyle);
    });

    /**
     * Mouseleave event handler. When the pointer leaves this node, revert the border to its normal stage.
     */
    all.on("mouseleave", function() {
	box.attr("style", "fill: " + args.fill + borderStyle);
    });
}

/**
 * Create a context menu at the given location. If the pointer leaves the menu, it will fade out and disappear.
 *     If the user clicks one of the options, the corresponding callback function will be triggered.
 * @param x the x coordinate
 * @param y the y coordinate
 * @param options an array of the names of the options and the corresponding callback functions
 * @param args optional arguments
 */
function contextMenu(x, y, options, args) {
    var n = options.length;

    /**
     * Set the default values of the arguments.
     */
    if (invalid(args)) args = {};
    var def = [
	["layer", LAYER_UI],
	["width", 200], ["height", 30], ["margin", 3],
	["fontSize", 16], ["fontFamily", "Arial"],
	["shadow", true], ["shadowX", 3], ["shadowY", 3],
	["shadowAlpha", 0.3], ["shadowFill", "rgb(100, 100, 100)"],
	["fill", "rgb(255, 255, 255)"], ["fillSelected", "rgb(240, 247, 255)"],
	["border", true], ["borderFill", "rgb(240, 240, 240)"], ["borderWidth", 1],
	["fadeInTime", 400], ["fadeOutTime", 400],
	["marginTop", 10], ["marginBottom", 10],
	["marginLeft", 10], ["marginRight", 10]
    ];
    for (var i in def)
	if (invalid(args[def[i][0]]))
	    args[def[i][0]] = def[i][1];


    /**
     * Create the top level group for this menu.
     */
    var all = args.layer.append("g");
    var itemHeight = args.height + args.margin;
    var marginX = args.marginLeft + args.marginRight;
    var marginY = args.marginTop + args.marginBottom;

    /**
     * Create an invisible hit box so to catch the mouseleave event.
     */
    all.append("rect")
	.attr("width", args.width + marginX).attr("height", itemHeight * n + marginY)
	.attr("x", x - args.marginLeft).attr("y", y - args.marginTop)
	.attr("style", "fill: transparent");
    all.on("mouseleave", function () {
	all.transition().duration(args.fadeOutTime).style("opacity", 0).remove();
    });

    /**
     * Create all the items in the list.
     */
    var borderStyle = args.border ? ("; stroke: " + args.borderFill +
				     "; stroke-width: " + args.borderWidth) : "";
    var styleNormal = "fill: " + args.fill + borderStyle;
    var styleActive = "fill: " + args.fillSelected + borderStyle;
    var textStyle = "pointer-events: none; font-family: " + args.fontFamily +
	"; font-size: " + args.fontSize;
    for (var i = 0; i < n; ++i) {
	var item = all.append("g");
	if (args.shadow) {
	    item.append("rect")
		.attr("width", args.width)
		.attr("height", args.height)
		.attr("x", x + args.shadowX)
		.attr("y", y + args.shadowY)
		.attr("style", "fill: " + args.shadowFill +
		      "; fill-opacity: " + args.shadowAlpha)
	}
	item.append("rect")
	    .attr("width", args.width)
	    .attr("height", args.height)
	    .attr("x", x)
	    .attr("y", y)
	    .attr("style", styleNormal)
	    .on("mouseover", function () {
		d3.select(this).attr("style", styleActive)
	    })
	    .on("mouseleave", function () {
		d3.select(this).attr("style", styleNormal)
	    })
	    .on("click", (function () {
		var id = i;
		return function (x) {
		    all.remove();
		    if (!invalid(options[id][1]))
			options[id][1](x);
		};
	    })());

	item.append("text")
	    .attr("x", x + 10).attr("y", y + args.height / 2).attr("alignment-baseline", "central")
	    .text(options[i][0]).attr("style", textStyle);

        /**
         * Play the fade in animation when the menu is launched.
         */
	item.transition().duration(args.fadeInTime).attr("transform",
							 "translate(" + 0 + ", " + (i * (args.height + args.margin)) + ")");
    }
}

/**
 * Launch the main menu when one right clicks on the background.
 */
LAYER_LOWEST.on("contextmenu", function () {
    d3.event.preventDefault();
    var x = d3.event.x, y = d3.event.y;
    contextMenu(x, y,
		[["Create New Node", function () {
		    contextMenu(x, y,
				[["If Branch", function () {
				    node(x, y, { style: 2, height: 50, width: 265,
						 fill: "rgb(255, 235, 148)", shadowX: 4,
						 content: "If&nbsp;&nbsp;(&nbsp;<input size=\"16\"/>&nbsp;)" });
				}],
				 ["Hub", function () {
				     node(x, y, { style: 1, width: 40, height: 40,
						  fill: "rgb(174, 133, 232)"});
				 }],
				 ["Execute Command", function () {
				     node(x, y, { fill: "rgb(255, 160, 160)",
						  content: "Execute Command:<textarea rows=\"7\" cols=\"22\"></textarea>" });
				 }],
				 ["Variable Assignment", function () {
				     node(x, y, { style: 0, width: 320, height: 50,
						  fill: "rgb(255, 160, 160)",
						  content: "Set <input size=\"6\" style=\"text-align: right\"> = <input size=\"16\">" });
				 }],
				 ["File", function () {
				     node(x, y, { rx:30, ry:30, style: 0, height:50, width: 225,
						  fill: "rgb(147, 181, 233)",
						  content: "File <input size = \"16\"/>"});
				 }],
				 ["Input", function () {
				     node(x, y, { rx:30, ry:30, style: 0, height:40, width:100,
						  fill: "rgb(100, 200, 100)",
						  content: "INPUT", contentX: 27 })
				 }],
				 ["Output", function () {
				     node(x, y, { rx:30, ry:30, style: 0, height:40, width:105,
						  fill: "rgb(188, 88, 188)",
						  content: "OUTPUT", contentX: 20 })
				 }]]); }],
		 ["Clear All", function () {
		     LAYER_LOWER.selectAll("*").remove();
		     LAYER_HIGHER.selectAll("*").remove();
		 }]], {});
});
