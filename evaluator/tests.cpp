#include "parser.hpp"
#include "eval.h"

#include <bits/stdc++.h>

using namespace std;

/**
 * Functor class that records each call, appending the option and its arguments to the specified string.
 */
class generic
{
public:
    string & r;

    void operator () (const string & s, const vector<string> & v)
    {
        if (!r.empty())
            r += "; ";
        r += s;
        r += "(";
        for (size_t i = 0; i < v.size(); ++i) {
            if (i)
                r += ", ";
            r += v[i];
        }
        r += ")";
    }

    generic(string & s):
            r(s)
    {
    }
};

#undef assert
#define assert(x) my_assert(x)
void my_assert(bool b)
{
    if (!b)
        throw exception();
}


void parser_simple()
{
    parser p; string r;
    p.add("a", [&](const string & s, const vector<string> & v) {
        assert(v.size() == 0);
        assert(s == "a");
        r += "A";
    }, 0, 0);
    p.add("b", [&](const string & s, const vector<string> & v) {
        assert(v.size() == 1);
        assert(s == "b");
        assert(v[0] == "arg");
    }, 1, 1);
    vector<string> v, args {"a", "b", "arg"};
    p.parse(v, args.begin(), args.end());
}

void parser_too_few_arguments()
{
    vector<string> v { "atan2", "y" }, x; string r;
    parser p; p.add("atan2", generic(r), 2, 2);
    try {
        p.parse(x, v.begin(), v.end());
        assert(false);
    }
    catch (string & s) {
        assert(s == "atan2");
    }
}

void parser_variable_length()
{
    parser p; string r; vector<string> v;
    p.add("foo", generic(r), 1, 3);

    p.parse(v, vector<string> { "foo", "1" });
    assert(v.empty());
    assert(r == "foo(1)");
    r.clear();

    p.parse(v, vector<string> { "foo", "1", "2" });
    assert(v.empty());
    assert(r == "foo(1, 2)");
    r.clear();

    p.parse(v, vector<string> { "foo", "1", "2", "3" });
    assert(v.empty());
    assert(r == "foo(1, 2, 3)");
    r.clear();

    p.parse(v, vector<string> { "foo", "1", "2", "3", "4" });
    assert(v.size() == 1 && v[0] == "4");
    assert(r == "foo(1, 2, 3)");
    r.clear();
}

void parser_options_no_args()
{
    parser p; string r; vector<string> v;
    p.add("A", generic(r), 0, 0);
    p.add("B", generic(r), 0, 0);
    p.add("C", generic(r), 0, 0);
    p.parse(v, vector<string> { "A", "x", "B", "C", "y", "z" });
    assert(r == "A(); B(); C()");
    assert(v.size() == 3 && v[0] == "x" && v[1] == "y" && v[2] == "z");
}

void parser_greedy()
{
    parser p; string r; vector<string> v;
    p.add("max", generic(r), 0, 1000);
    p.add("min", generic(r), 0, 1000);
    p.parse(v, vector<string> { "max", "1", "2", "3", "min", "4" });
    assert(r == "max(1, 2, 3); min(4)");
    assert(v.empty());
}

void parser_max_less_than_min()
{
    parser p; string r; vector<string> v;
    p.add("foo", generic(r), 1, 0);
    p.parse(v, vector<string> { "foo", "1", "2" });
    assert(r == "foo(1)");
    assert(v.size() == 1 && v[0] == "2");
}

void parser_unused()
{
    parser p; string r; vector<string> v;
    p.add("foo", generic(r), 1, 3);
    p.add("bar", generic(r), 0, 1);
    p.parse(v, vector<string> { "x", "foo", "1", "2", "bar", "foo", "3", "4", "5", "6", "bar", "7", "8" });
    assert(r == "foo(1, 2); bar(); foo(3, 4, 5); bar(7)");
    assert(v.size() == 3);
    assert(v[0] == "x");
    assert(v[1] == "6");
    assert(v[2] == "8");
}

void parser_empty_range()
{
    parser p; string r; vector<string> v;
    p.add("foo", generic(r), 0, 1000);
    p.parse(v, vector<string> {});
    assert(r == "");
}

void eval_forever_500ms()
{
    char * v[4];
    v[0] = strdup("-time");
    v[1] = strdup("500ms");
    v[2] = strdup("forever");
    v[3] = nullptr;
    eval f(v); auto r = f();
    assert(double(r.rtime) > 300. && double(r.rtime) < 1000.0);
    assert(WIFSIGNALED(r.code) && WTERMSIG(r.code) == SIGKILL);
}

void eval_forever_1s()
{
    char * v[4];
    v[0] = strdup("-time");
    v[1] = strdup("1s");
    v[2] = strdup("forever");
    v[3] = nullptr;
    eval f(v); auto r = f();
    assert(double(r.rtime) > 800. && double(r.rtime) < 2000.0);
    assert(WIFSIGNALED(r.code) && WTERMSIG(r.code) == SIGKILL);
}

void eval_wait()
{
    char * v[3];
    v[0] = strdup("/bin/sleep");
    v[1] = strdup("1");
    v[2] = nullptr;
    eval f(v); auto r = f();
    assert(double(r.rtime) > 800. && double(r.rtime) < 1200.0);
    assert(WIFEXITED(r.code));
}

void eval_wait_kill()
{
    char * v[5];
    v[0] = strdup("/bin/sleep");
    v[1] = strdup("1");
    v[2] = strdup("-time");
    v[3] = strdup("200ms");
    v[4] = nullptr;
    eval f(v); auto r = f();

    assert(double(r.rtime) > 100. && double(r.rtime) < 400.0);
    assert(WIFSIGNALED(r.code));
}

void eval_mem_100m()
{
    char * v[16];
    v[0] = strdup("mem");
    v[1] = strdup("100");
    v[2] = nullptr;
    eval f(v); auto r = f();
    assert(r.rtime < 100);
    assert(r.mem > 90 * 1024 && r.mem < 110 * 1024);
    assert(WIFEXITED(r.code));
}

void eval_mem_50m_kill()
{
    char * v[16];
    v[0] = strdup("mem");
    v[1] = strdup("500");
    v[2] = strdup("-mem");
    v[3] = strdup("20m");
    v[4] = strdup("-stderr");
    v[5] = strdup("/dev/null");
    v[6] = nullptr;
    eval f(v); auto r = f();
    assert(WIFSIGNALED(r.code));
}

int main()
{
    void (* v[])() = {
            parser_simple,
            parser_too_few_arguments,
            parser_variable_length,
            parser_options_no_args,
            parser_greedy,
            parser_max_less_than_min,
            parser_unused,
            parser_empty_range,
            eval_forever_500ms,
            eval_forever_1s,
            eval_wait,
            eval_wait_kill,
            eval_mem_100m,
            eval_mem_50m_kill

    };
    size_t n = 0, m = 0;
    cerr << "[";
    for (auto p : v) {
        try {
            p(); ++n;
            cerr << "O";
        }
        catch (...) {
            cerr << "X";
        }
        ++m;
    }
    cerr << "]" << endl;
    cerr << "total: " << n << "/" << m << endl;
    return 0;
}