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
		["content", null], ["pipeCount", 1], ["op", "(NOP)"]
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
	var d = {x: 0, y: 0, ox: x, oy: y, width: args.width, height: args.height,
		links: {}, id: newId(), pipeCount: args.pipeCount, op: args.op};
	all.data([d]);

	/**
	 * Helper function that creates the specified shape (args.style) at the given location.
	 * There are three options available: rectangles (could be rounded), ellipses and hexagons.
	 * @param x the x coordinate
	 * @param y the y coordinate
	 * @param r where to append this shape
	 * @returns {*}
	 */
	var shape = function (x, y, r, b) {
		var w = args.width;
		var h = args.height;
		var w_2 = w / 2.0;
		var h_2 = h / 2.0;
		var p = Math.sqrt(w_2*w_2 + h_2*h_2);
		var cx = x + w_2, cy = y + h_2;
		if (invalid(r)) r = all;
		if (invalid(b)) b = false;
		d.center = function () {
			return [d.x + cx, d.y + cy];
		};
		if (args.style == 0) {
			if (b) {
				d.border = (function () {
					var f = makePolygonBorder([-w_2, -w_2, w_2, w_2], [-h_2, h_2, h_2, -h_2]);
					return function (a) {
						var [rx, ry] = f(a);
						return [d.x + cx + rx, d.y + cy + ry];
					};
				}) ();
				/*d.border = function (a) {
				 var r = Math.atan2(h, w);
				 a = angle(a);
				 if (a < r || a >= PI2 - r)
				 return [d.x + x + w, d.y + cy - p * Math.sin(a)];
				 else if (a < PI - r)
				 return [d.x + cx + p * Math.sin(PI_2 - a), d.y + y]
				 else if (a < PI + r)
				 return [d.x + x, d.y + cy - p * Math.sin(PI - a)];
				 else
				 return [d.x + cx + p * Math.sin(a - PI * 1.5), d.y + y + h];
				 };*/
			}
			return r.append("rect")
				.attr("x", x)
				.attr("y", y)
				.attr("width", w)
				.attr("height", h)
				.attr("rx", args.rx)
				.attr("ry", args.ry);
		}
		else if (args.style == 1) {
			if (b)
				d.border = function (a) {
					a = angle(a);
					var s = Math.sin(a);
					var c = Math.cos(a);
					var r = w_2 * h_2 / Math.sqrt(w_2*w_2*s*s + h_2*h_2*c*c);
					return [d.x + cx + r*c, d.y + cy - r*s];
				}
			return r.append("ellipse")
				.attr("rx", w_2)
				.attr("ry", h_2)
				.attr("cx", cx)
				.attr("cy", cy);
		}
		else if (args.style == 2) {
			var rx = [
				x,
				x + args.spikeWidth,
				x + w - args.spikeWidth,
				x + w,
				x + w - args.spikeWidth,
				x + args.spikeWidth
			];;
			var ry = [
				cy, y + h, y + h, cy, y, y
			];
			if (b)
				d.border = (function () {
					var f = makePolygonBorder(vectorAddScalar(rx, -cx), vectorAddScalar(ry, -cy));
					return function (a) {
						var [rx, ry] = f(a);
						return [d.x + cx + rx, d.y + cy + ry];
					};
				}) ();
			return r.append("path")
				.attr("d", [
					"M", rx[0], ry[0],
					"L", rx[1], ry[1],
					"L", rx[2], ry[2],
					"L", rx[3], ry[3],
					"L", rx[4], ry[4],
					"L", rx[5], ry[5],
					"Z"
				].join(" "));
		}
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
	var box = shape(x, y, all, true)
		.attr("style", "fill: " + args.fill + borderStyle);

	/**
	 * Create the content of the node.
	 */
	var content = args.content == null ? null : all.append("foreignObject")
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
		if (content != null)
			content.attr("transform", s);
		//all.moveToFront();

		for (var i in all.data()[0].links)
			updateLink(all.data()[0].links[i])
	}));

	/**
	 * Contextmenu event handler. When the user right clicks the background of the node,
	 *     display a menu of options to manipulate this node.
	 */
	box.on("contextmenu", function () {
		d3.event.preventDefault();
		var [rx, ry] = d3.mouse(this)
		contextMenu(d.x + rx, d.y + ry, [
			["Bring To Front", function () {
				all.moveToFront();
			}],
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
		//d3.select(this).moveToFront();
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
    return all;
}
