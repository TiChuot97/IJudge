/**
 * Generate a JSON representation of the current state of the graph.
 */
function save() {
    nodes = [];
    LAYER_NODES.selectAll("g").each(function (d) {
        var v = [];
        var t = d3.select(this).select("foreignObject");
        t.selectAll(["select", "input", "textarea"]).each(function (d) {
            var r = d3.select(this).property("value");
            if (!invalid(r)) v.push(r);
        });
        nodes.push({id: d.id, op: d.op, data: v, x: d.x + d.ox, y: d.y + d.oy});
    });
    edges = [];
    LAYER_EDGES.selectAll("g").each(function (d) {
        var lbl = "";
        var t = d3.select(this).selectAll("foreignObject");
        t.selectAll("*").each(function () {
            lbl = d3.select(this).property("value");
        });
        var r = [d.type == 0 ? "->" : "-|", d.src.data()[0].id, d.dst.data()[0].id, lbl];
        edges.push(r);
    });
    var s = JSON.stringify({nodes: nodes, edges: edges});
    console.log(s);
    return s;
}
