# this is a generic graph library which can be used in various senarios
# the library is optimized for both performance and easy-to-use
# most operations can be done with a theoritically optimal time complexity

# the Edge class
class Edge:
    # constructor, each edge object has the following fields:
    #     id:   the id of the edge, or an alias
    #           the id could be None, which means the edge does not have an alias (unnamed node)
    #     src:  the source
    #     dst:  the destination
    #     data: the user specified satellite data
    def __init__(self, src, dst, id = None, data = None):
        self.id = id
        self.src, self.dst = src, dst
        self.data = data

# the Node class
class Node:
    # helper function that updates the information when adding an edge
    def link(self, e):
        def fun(f, i, j, e):
            if self == i:
                if j not in f:
                    f[j] = set()
                f[j].add(e)
        fun(self.e_out, e.src, e.dst, e)
        fun(self.e_in,  e.dst, e.src, e)

    # helper function that updates the information when removing en edge
    def unlink(self, e):
        def fun(f, i, j, e):
            if self == i:
                f[j].remove(e)
        fun(self.e_out, e.src, e.dst, e)
        fun(self.e_in,  e.dst, e.src, e)

    # constructor, each node object has the following fields:
    #     id:    the id of the node, or an alias for your understanding, which provides easy access
    #            the id can be None, which means the node does not have an alias (unnamed node)
    #     e_in:  the set of all edges that come to this node
    #     e_out: the set of all edges that go from this node
    #     data:  user specified satellite data
    def __init__(self, id = None, data = None):
        self.id = id
        self.data = data
        self.e_in, self.e_out = {}, {}
        
class Graph:
    # dereference the id and get the mapped node object
    # if the node object itself is passed in, the lookup process simply checks if it is in the graph or not
    # returns None if failed
    def lookup(ref, f, g):
        if ref in f:
            return f[ref]
        elif ref in g:
            return ref
        else:
            return None

    def edge(self, ref):
        return Graph.lookup(ref, self.ef, self.e)

    def node(self, ref):
        return Graph.lookup(ref, self.vf, self.v)

    # create a node if it doesn't exist
    def default(self, ref):
        v = self.node(ref)
        if v == None:
            v = Node(ref)
            self.v.add(v)
            if ref != None:
                self.vf[ref] = v
        return v

    # add a new node to the graph
    def add_node(self, id = None, data = None):
        r = Node(id, data)
        self.v.add(r)
        if id != None:
            self.vf[id] = r
        return r

    # add an edge to the graph, creates new nodes if they don't exist
    def add_edge(self, src, dst, id = None, data = None):
        s, t = self.default(src), self.default(dst)
        e = Edge(s, t, id, data)
        self.e.add(e)
        if e.id != None:
            self.ef[e.id] = e
        s.link(e)
        t.link(e)
        return e

    # remove an edge from the graph
    def remove_edge(self, ref):
        e = self.edge(ref)
        if e == None:
            raise Exception('invalid edge')
        self.e.remove(e)
        if e.id != None:
            self.ef.remove(e.id)
        e.src.unlink(e)
        e.dst.unlink(e)

    # remove a node from the graph, also deleting the edges connected to the graph
    def remove_node(self, ref):
        v = self.vertex(ref)
        if v == None:
            raise Exception('invalid node')
        r = []
        def gather(f):
            for k, v in f.items():
                for x in v:
                   r.append(x)
        gather(v.e_in)
        gather(v.e_out)
        for e in r:
            self.remove_edge(e)
        self.v.remove(v)
        if v.id != None:
            del self.vf[v.id]

    # list all edges from src to dst, None stands for whildcard here
    #     specifically, (None, None) lists all edges
    #                   (src,  None) lists all edges that goes from src
    #                   (None,  dst) lists all edges that goes to dst
    #                   (src,   dst) lists all edges that goes from src to dst
    def list_edges(self, src = None, dst = None):
        r = []
        def check(x):
            if x != None:
                x = self.node(x)
                if x == None:
                    raise Exception('invalid')
            return x
        src, dst = check(src), check(dst)
        if src == None and dst == None:
            for e in self.e:
                r.append(e)
        elif src != None and dst == None:
            for k, v in src.e_out.items():
                for e in v:
                    r.append(e)
        elif src == None and dst != None:
            for k, v in dst.e_in.items():
                for e in v:
                    r.append(e)
        else:
            if dst in src.e_out:
                for e in src.e_out[dst]:
                    r.append(e)
        return r

    # constructor, a graph object is essentially a composition of four hashtables
    #   1) the set of all nodes
    #   2) the set of all edges
    #   3) the map of ids to nodes
    #   4) the map of ids to edges
    def __init__(self):
        self.v, self.e = set(), set()
        self.vf, self.ef = {}, {}

        
