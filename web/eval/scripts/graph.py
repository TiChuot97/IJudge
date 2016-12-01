class Edge:
    def __init__(self, src, dst, id = None, data = None):
        self.id = id
        self.src, self.dst = src, dst
        self.data = data

class Node:
    def link(self, e):
        def fun(f, i, j, e):
            if self == i:
                if j not in f:
                    f[j] = set()
                f[j].add(e)
        fun(self.e_out, e.src, e.dst, e)
        fun(self.e_in,  e.dst, e.src, e)

    def unlink(self, e):
        def fun(f, i, j, e):
            if self == i:
                f[j].remove(e)
        fun(self.e_out, e.src, e.dst, e)
        fun(self.e_in,  e.dst, e.src, e)
    
    def __init__(self, id = None, data = None):
        self.id = id
        self.data = data
        self.e_in, self.e_out = {}, {}
        
class Graph:
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
    
    def default(self, ref):
        v = self.node(ref)
        if v == None:
            v = Node(ref)
            self.v.add(v)
            if ref != None:
                self.vf[ref] = v
        return v

    def add_node(self, id = None, data = None):
        r = Node(id, data)
        self.v.add(r)
        if id != None:
            self.vf[id] = r
        return r

    def add_edge(self, src, dst, id = None, data = None):
        s, t = self.default(src), self.default(dst)
        e = Edge(s, t, id, data)
        self.e.add(e)
        if e.id != None:
            self.ef[e.id] = e
        s.link(e)
        t.link(e)
        return e

    def remove_edge(self, ref):
        e = self.edge(ref)
        if e == None:
            raise Exception('invalid edge')
        self.e.remove(e)
        if e.id != None:
            self.ef.remove(e.id)
        e.src.unlink(e)
        e.dst.unlink(e)

    def remove_vertex(self, ref):
        v = self.vertex(ref)
        if v == None:
            raise Exception('invalid vertex')
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
                    
    def __init__(self):
        self.v, self.e = set(), set()
        self.vf, self.ef = {}, {}

        
