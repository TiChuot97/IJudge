# the main program of the flowchart interpreter

# imports
from graph import *
from common import *
from nodes import *

from pprint import *
from collections import deque

import json, sys, os

# load the json from stdin, parse it and build the graph
r = json.loads(sys.stdin.read())
js = r
g = Graph()

for e in r['edges']:
    v = e[3].split(',')
    for i in range(len(v)):
        v[i] = v[i].strip()
    g.add_edge(e[1], e[2], data = [e[0], set(v)])
    
for v in r['nodes']:
    t = g.node(v['id'])
    if v['op'] in Handlers:
        T = Handlers[v['op']]
        q = {}
        for e in g.list_edges(None, t):
            q[e.src] = deque()
        p = T(); t.data = p
        p.d = v['data']
        p.q = q
        p.e_in = t.e_in
        p.e_out = t.e_out
    else:
        raise Exception("unrecoginized node '%s'" % v['op'])

# initialize the queue
# nodes that have no dependencies are added to the queue
q = deque()
for v in g.v:
    if v.data.ready():
        q.append(v)

# the evaluation process
#   1) get a node from the queue
#   2) execute the operation of that node
#   3) mark all outgoing edges (dependencies) as resolved, sending data to next nodes,
#          check if these nodes are ready, if they are, push them into the queue
#   4) repeat step 1 to step 3 until the queue is empty
#   5) write output to stdout
OUT = None
while len(q) > 0:
    s = q.popleft()
    with s.data.mt:
        r = s.data.run()
        # handle global input and output
        if 'ret' in r:
            OUT = r['ret']
        if 'input' in r:
            r['out'] = js['input']
        for e in g.list_edges(s, None):
            d = dict(r); lbl = e.data[1]
            # check if there is any branch conditions
            if 'br' in d and d['br'] not in lbl:
                continue
            # whenever the data goes through a pipe, the output (or error) of the last node becomes the
            #     input of the next node
            if e.data[0] == '-|':
                if 'out' in lbl and 'err' in lbl:
                    raise Exception('<pipe>: cannot redirect both streams')
                elif 'err' in lbl:
                    if 'err' not in d:
                        raise Exception('<pipe>: no data to redirect')
                    d['in'] = d['err']
                else:
                    if 'out' not in d:
                        raise Exception('<pipe>: no data to redirect')
                    d['in'] = d['out']
            # push the data flow to the next nodes, push them onto the queue if they are ready
            p = e.dst
            with p.data.mt:
                p.data.push(s, d)
                if p.data.ready():
                    q.append(p)


# output of the whole program
if OUT == None:
    print('(no output)')
else:
    print(str(OUT), end = '')
