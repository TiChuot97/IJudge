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
		.attr("x", x + args.shadowX + 1)
		.attr("y", y + args.shadowY + 1)
		.attr("style", "fill: " + args.shadowFill +
		      "; fill-opacity: " + args.shadowAlpha)
	}
	item.append("rect")
	    .attr("width", args.width)
	    .attr("height", args.height)
	    .attr("x", x + 1)
	    .attr("y", y + 1)
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
