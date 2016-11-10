var svg = d3.select("body").append("svg")
    .attr("width", 800)
    .attr("height", 800)
    .attr("border", 1);

var lowest = svg.append("g");
var lower = svg.append("g");
var higher = svg.append("g");
var highest = svg.append("g");
var ui = highest;
var border = svg.append("g");

var xx = [0, 0, 800, 800], yy = [0, 800, 800, 0];
for (var i = 0; i < 4; ++i) {
    var j = i == 3 ? 0 : i + 1;
    border.append("line").attr("x1", xx[i]).attr("y1", yy[i]).attr("x2", xx[j]).attr("y2", yy[j]).attr("style", "stroke:rgb(0,0,0)");
}
//var border = svg.append("g");

lowest.append("rect")
    .attr("width", 800)
    .attr("height", 800)
    .attr("style", "fill: white");;

/*border.append("rect")
    .attr("width", 800)
    .attr("height", 800)
    .attr("style", "fill: transparent; stroke-width:3; stroke:rgb(0, 0, 0)");;*/

function sector(x, y, r, a1, a2) {
    var d = (a2 - a1) % (2.0 * Math.PI);
    if (d < 0.0) d += 2.0 * Math.PI;
    var s = "M " + x + " " + y + " ";
    var x1 = x + r * Math.cos(a1);
    var y1 = y + r * Math.sin(a1);
    var x2 = x + r * Math.cos(a2);
    var y2 = y + r * Math.sin(a2);
    s = s + "L " + x1 + " " + y1 + " ";
    s = s + "A " + r + " " + r + " 0 " + (d > Math.PI ? 1 : 0)
	+ " 1 " + x2 + " " + y2 + " ";
    s += "L " + x + " " + y;
    return s;
}


function drag(d) {
    var r = d3.select(this);
    d.x += d3.event.dx;
    d.y += d3.event.dy;
    r.attr("cx", d.x);
    r.attr("cy", d.y);
}

function add_draggable(x, y) {
    svg.append("circle")
	.data([{"x":x, "y":x}])
	.attr("cx", x)
	.attr("cy", y)
	.attr("r", 32)
	.attr("style", "fill:rgb(200, 98, 179); fill-opacity:0.3")
	.call(d3.drag().on("drag", drag))
	
}

function invalid(x) {
    return x === undefined || x === null;
}


// layer
// width, height
// font, font-size
// shadow, shadowY, shadowX, shadowAlpha, shadowFill
// fill, border, borderFill, borderWidth, style

// Source: https://github.com/wbkd/d3-extended
d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
	this.parentNode.appendChild(this);
    });
};

function node(x, y, args) {
    if (invalid(args)) args = {};
    var def = [
	["layer", higher],
	["style", 0],
	["shadow", true], ["shadowX", 2], ["shadowY", 3], ["shadowAlpha", 0.3],
	["shadowAlpha", 0.3], ["shadowFill", "rgb(100, 100, 100)"],
	["width", 250], ["height", 180], ["rx", 0], ["ry", 0],
	["fill", "rgb(255, 255, 255)"], ["border", true],
	["borderFill", "rgb(222, 222, 222)"], ["borderWidth", 1],
	["contentX", 15], ["contentY", 15], ["content", "<div>Example:<input/></div>"]
    ];
    
    for (var i in def)
	if (invalid(args[def[i][0]]))
	    args[def[i][0]] = def[i][1];

    var shape = function (x, y) {
	if (args.style == 0)
	    return all.append("rect")
	    .attr("x", x)
	    .attr("y", y)
	    .attr("width", args.width)
	    .attr("height", args.height)
	    .attr("rx", args.rx)
	    .attr("ry", args.ry);
	else if (args.style == 1)
	    return all.append("ellipse")
	    .attr("rx", args.width / 2)
	    .attr("ry", args.height / 2)
	    .attr("cx", x + args.width / 2)
	    .attr("cy", y + args.height / 2)
    };
    var all = args.layer.append("g");
    all.data([{"x" : 0, "y" : 0}]);

    // shadow
    if (args.shadow) {
	var shadow = shape(x + args.shadowX, y + args.shadowY)
	    .attr("style", "fill: " + args.shadowFill +
		  "; opacity: " + args.shadowAlpha);
    }

    // block
    var borderStyle = args.border ? ("; stroke: " + args.borderFill +
				     "; stroke-width: " + args.borderWidth) : "";
    var box = shape(x, y)
	.attr("style", "fill: " + args.fill + borderStyle);

    // content
    var content = all.append("foreignObject")
	.attr("width", args.width - args.contentX * 2)
	.attr("height", args.height - args.contentY * 2)
	.attr("x", x + args.contentX)
	.attr("y", y + args.contentY)
	.html(args.content)
    
    box.call(d3.drag().on("drag", function (d) {
	var s = "translate(" + (d.x += d3.event.dx) + ", " + (d.y += d3.event.dy) + ")";
	box.attr("transform", s);
	if (args.shadow) shadow.attr("transform", s);
	content.attr("transform", s);
    }));;

    box.on("contextmenu", function (d, i) {
	d3.event.preventDefault();
	contextMenu(d3.event.x, d3.event.y, [["Dependency"], ["Pipe"], ["Delete", function (d) {
	    all.remove();
	}]]);
    });

    all.on("click", function (d) {
	d3.select(this).moveToFront();
    });
}

// layer
// width, height, margin
// font, font-size
// shadow, shadow-y-offset, shadow-x-offset, shadow-opacity, shadow-color
// fill, border, border-color, border-width
function contextMenu(x, y, options, args) {
    var n = options.length;

    // set default values for the arguments if not given
    
    if (invalid(args)) args = {};
    var def = [
	["layer", ui],
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
    
    var all = args.layer.append("g");
    var itemHeight = args.height + args.margin;
    var marginX = args.marginLeft + args.marginRight;
    var marginY = args.marginTop + args.marginBottom;

    // create an invisible hitbox so to catch the mouse leaving the menu event
    all.append("rect")
	.attr("width", args.width + marginX).attr("height", itemHeight * n + marginY)
	.attr("x", x - args.marginLeft).attr("y", y - args.marginTop)
	.attr("style", "fill: transparent");
    // when the mouse leaves the menu, fade out and delete the menu
    all.on("mouseleave", function (d) {
	all.transition().duration(args.fadeOutTime).style("opacity", 0).remove();
    });

    // create all the items
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
	    .on("mouseover", function (d) {
		d3.select(this).attr("style", styleActive)
	    })
	    .on("mouseleave", function (d) {
		d3.select(this).attr("style", styleNormal)
	    })
	    .on("click", (function () {
		var id = i;
		return function (d) {
		    all.remove();
		    if (!invalid(options[id][1]))
			options[id][1](d);
		};
	    })())
	    
	item.append("text")
	    .attr("x", x + 10).attr("y", y + args.height / 2).attr("alignment-baseline", "central")
	    .text(options[i][0]).attr("style", textStyle);
	// the fade in animation
	item.transition().duration(args.fadeInTime).attr("transform",
					     "translate(" + 0 + ", " + (i * (args.height + args.margin)) + ")");
    }
}

lowest.on("contextmenu", function (d, i) {
    d3.event.preventDefault();
    var x = d3.event.x, y = d3.event.y;
    contextMenu(x, y,
		[["Create New Node", function (d) {
		    contextMenu(x, y,
				[["If Branch"],
				 ["Hub"],
				 ["Run Command", function (d) {
				     node(x, y, { "content": "<div>Execute Command:<input/></div>" });
				 }],
				 ["File"],
				 ["Input"],
				 ["Output"]]); }],
		 ["Clear All"]], {});
})
