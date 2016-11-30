/**
 * Launch the main menu when one right clicks on the background.
 */
LAYER_LOWEST.on("contextmenu", function () {
    d3.event.preventDefault();
    var [x, y] = d3.mouse(this);
    var f = function(v) {
	if (typeof v === 'string')
	    node(x, y, NODES[v])
	else {
	    var list = v.map(function (x) {
		return [x[0], function () { f(x[1]) }];
	    });
	    contextMenu(x, y, list);
	}
    };
    var clear = function() {
	LAYER_LOWER.selectAll("*").remove();
	LAYER_HIGHER.selectAll("*").remove();
    };
    contextMenu(x, y,
		[
		    ["Create New Node", function () {
			f(MENU);
		    }],
		    ["Import", function () {
			var r = window.prompt("Paste From Clipboard", "");
			try { r = JSON.parse(r); } catch(err) { alert('invalid format'); }
			clear(); load(r);
		    }],
		    ["Export", function () {
			window.prompt("Copy To Clipboard", save());
		    }],
		    ["Clear All", function () {
			clear();
		    }]
		]);
});

console.log('success');
