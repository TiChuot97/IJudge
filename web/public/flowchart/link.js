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
    if (d.type == 1) ++d.dst.data()[0].pipeCount;
    var u = d.src.data()[0], v = d.dst.data()[0];
    delete u.links[d.id];
    delete v.links[d.id];
    p.remove();
}

/**
 * Update the given link, recomputing the start and end point.
 * @param p the link to update
 */
function updateLink(p) {
    var d = p.data()[0];
    var u = d.src.data()[0], v = d.dst.data()[0];
    var [x1, y1] = u.center();
    var [x2, y2] = v.center();
    var a = Math.atan2(y1 - y2, x2 - x1);
    [x1, y1] = u.border(a);
    [x2, y2] = v.border(a + PI);
    p.select("path").attr("d", pathLinspace(x1, y1, x2, y2, 15));
    p.select("line").attr("x1", x1).attr("x2", x2)
	.attr("y1", y1).attr("y2", y2);
    if (d.lbl)
	p.select("foreignObject")
	.attr("x", (x1 + x2) * .5 - 30.)
	.attr("y", (y1 + y2) * .5 - 13);
}

function toggle_label(p) {
    var d = p.data()[0];
    if (d.lbl) 
	p.select("foreignObject").remove();
    else
	p.append("foreignObject").attr("width", 100).attr("height", 30)
	    .html("<input size=\"5\" type=\"text\" style=\"text-align: center;\">");
    d.lbl = !d.lbl;
    updateLink(p);
}

/**
 * Create a new link that goes from the first node to the second node.
 * @param a the first node
 * @param b the second node
 * @param type whether the link is a dependency or a pipe
 */
function link(a, b, type) {
    if (a == b) {
	alert('Cannot Link a Node to Itself');
	return;
    }
    var u = a.data()[0], v = b.data()[0];
    if (type == 1) {
	if (v.pipeCount > 0)
	    --v.pipeCount;
	else {
	    alert('Maximum Number of Incoming Pipes');
	    return;
	}
    }
    var id = newId();
    var d = { src: a, dst: b, id: id, lbl: false, type: type};
    var p = LAYER_LOWER.append("g").data([d]);
    var x = p.append("path").attr("marker-mid", "url(#arrow)");
    if (type == 1) x.attr("stroke", "black").attr("stroke-width", 1);
    var y = p.append("line").attr("stroke", "transparent").attr("stroke-width", 20);
    u.links[id] = v.links[id] = p;

    updateLink(p);

    y.on("contextmenu", function (d, i) {
	d3.event.preventDefault();
	var v = [];
	v.push([d.lbl ? "Remove Label" : "Label", function () {
	    toggle_label(p);
	}]);
	v.push(["Delete", function () {
	    removeLink(p);
	}]);
	var [rx, ry] = d3.mouse(this);
	contextMenu(rx, ry, v);
    });

    return p;
}
