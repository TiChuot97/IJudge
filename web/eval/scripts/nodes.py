from common import *
from collections import deque
from os import system
from threading import Lock
import shlex
import subprocess as sub

class Handler:
    def validate(self):
        return True
    
    def push(self, src, d):
        if src not in self.q:
            raise Exception('<handler>: invalid source')
        self.q[src].append(d)
    
    def ready(self):
        for src, q in self.q.items():
            if len(q) <= 0:
                return False
        return True

    def select(self, f = lambda _ : True, pop = True):
        v = []
        for _, q in self.q.items():
            if len(q) > 0:
                r = q.popleft() if pop else q[0]
                if f(r):
                    v.append(r)
        return v
    
    def select_not_none(self, pop = True):
        return self.select(lambda x : x != None, pop)

    def run(self):
        # do nothing
        return 0
    
    def __init__ (self):
        self.d = None
        self.mt = Lock()

class Any(Handler):
    def ready(self):
        for src, q in self.q.items():
            if len(q) > 0:
                return True
        return False

    def run(self):
        for _, q in self.q.items():
            if len(q) > 0:
                return q.popleft()
        return {}

class IfExitcode(Handler):
    rel = {'='  : (lambda x, y : x == y),
           '<'  : (lambda x, y : x <  y),
           '>'  : (lambda x, y : x >  y),
           '<=' : (lambda x, y : x <= y),
           '>=' : (lambda x, y : x >= y),
           '<>' : (lambda x, y : x != y)}

    def validate(self):
        if len(self.q) != 1:
            raise Exception('<if_exitcode>: invalid number of inputs')
    
    def run(self):
        v = self.select(lambda x : 'exitcode' in x)
        if len(v) == 0:
            raise Exception("<if_exitcode>: invalid input")
        elif len(v) > 1:
            raise Exception("<if_exitcode>: too many inputs")
        else:
            v = v[0]; n = v['exitcode']
            f = IfExitcode.rel[self.d[0]]
            r = { 'exitcode': n,
                  'br': 'yes' if f(n, int(self.d[1])) else 'no'}
            if 'in' in v:
                r['out'] = v['in']
            return r

class Exec(Handler):
    def run(self):
        v = self.select(lambda x : 'in' in x)
        if len(v) > 1:
            raise Exception('<exec>: too many inputs piped in')
        d = None if len(v) < 1 else v[0]['in']
        x = shlex.split(self.d[0])
        p = sub.Popen(x, stdout = sub.PIPE,
                      stderr = sub.PIPE, stdin = sub.PIPE)
        out, err = p.communicate(d)
        r = {'out': out.decode('ascii'), 'err': err}
        r['exitcode'] = p.returncode
        return r

class Eval(Handler):
    def run(self):
        v = ['../utils/eval'] + shlex.split(self.d[0])
        v.append('-time'); v.append('%s%s' % (self.d[1], self.d[2]))
        v.append('-mem'); v.append('%s%s' % (self.d[3], self.d[4]))
        if self.d[5] != "":
            v.append('-stdin'); v.append(self.d[5])
        if self.d[6] != "":
            v.append('-stdout'); v.append(self.d[6])
        if self.d[7] != "":
            v.append('-stdout'); v.append(self.d[7])
        v.append('-style'); v.append(self.d[8])
        p = sub.Popen(v, stdout = sub.PIPE,
                      stderr = sub.PIPE, stdin = sub.PIPE)
        out, err = p.communicate()
        return {'out': out.decode('ascii'), 'err': err, 'exitcode': p.returncode}

class Cmp(Handler):
    def run(self):
        v = ['../utils/cmp', self.d[0], self.d[1]]
        if self.d[2] == "yes":
            v.append('--remove-leading-spaces')
        if self.d[3] == "yes":
            v.append('--remove-trailing-spaces')
        if self.d[4] == "yes":
            v.append('--remove-leading-blank')
        if self.d[5] == "yes":
            v.append('--remove-trailing-blank')
        v.append(self.d[6])
        p = sub.Popen(v, stdout = sub.PIPE,
                      stderr = sub.PIPE, stdin = sub.PIPE)
        out, err = p.communicate()
        return {'out': out.decode('ascii'), 'err': err, 'exitcode': p.returncode}
    
class File(Handler):
    def run(self):
        v = self.select(lambda x : 'in' in x)
        if len(v) > 1:
            raise Exception('<file>: too many inputs piped in')
        elif len(v) == 1:
            v = v[0]
            with open(self.d[0], 'w') as f:
                f.write(v['in'])
            return { 'out': v['in'] }
        else:
            with open(self.d[0], 'r') as f:
                return { 'out': f.read() }

class Output(Handler):
    def run(self):
        v = self.select(lambda x: 'in' in x)
        if len(v) > 1:
            raise Exception('<output>: too many inputs piped in')
        elif len(v) == 1:
            return { 'ret': v[0]['in'] }
        else:
            raise Exception('<output>: can only accept input')

class IfFile(Handler):
    def run(self):
        return { 'br': 'yes' if file_exists(self.d[0]) else 'no' }

class Input(Handler):
    def run(self):
        v = self.select(lambda x: 'in' in x)
        if (len(v) > 0):
            raise Exception('<input>: cannot accept input')
        else:
            return { 'input': True }
    
    
Handlers = {'or' : Any,
            'if_exitcode': IfExitcode,
            'exec' : Exec,
            'eval' : Eval,
            'file' : File,
            'output': Output,
            'if_file': IfFile,
            'cmp': Cmp,
            'input': Input}
