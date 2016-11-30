function load(v) {
    var f = {};
    for (var k in v.nodes) {
	var r = v.nodes[k];
	var t = node(r.x, r.y, NODES[r.op]);
	var n = 0;
	f[r.id] = t;
	t.selectAll(["select", "input", "textarea"]).each(function (d) {
	    d3.select(this).property("value", r.data[n++]);
        });
    }
    for (var k in v.edges) {
	var r = v.edges[k];
	var p = link(f[r[1]], f[r[2]], r[0] == '-|' ? 1 : 0);
	if (r[3] != "") {
	    toggle_label(p);
	    p.select("input").property("value", r[3]);
	}
    }
}
