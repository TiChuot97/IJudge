#include "eval.h"
#include "parser.hpp"

#include <cstring>

using namespace std;

/**
 * Stringify the result in a pretty way.
 * @return the pretty string representation of the result
 */
string eval_result::verbose()
{
    std::stringstream ss;
    if (WIFEXITED(code))
        ss << "exit code:   " << WEXITSTATUS(code) << std::endl;
    if (WIFSIGNALED(code))
        ss << "signal:      " << WTERMSIG(code) << std::endl;
    ss << "memory:      " << mem << " KB" << std::endl;
    ss << "user time:   " << utime << " ms" << std::endl;
    ss << "system time: " << stime << " ms" << std::endl;
    ss << "real time:   " << rtime << " ms";
    return string(ss.str());
}

/**
 * Sgringify the result as plain text. Intended to be used by other programs.
 * @return the plain text representation of the result
 */
string eval_result::plain()
{
    std::stringstream ss;
    if (WIFEXITED(code))
        ss << "exit " << WEXITSTATUS(code) << std::endl;
    if (WIFSIGNALED(code))
        ss << "signal " << WTERMSIG(code) << std::endl;
    ss << mem << std::endl;
    ss << utime << std::endl;
    ss << stime << std::endl;
    ss << rtime;
    return string(ss.str());
}

/**
 * Stringify the result as json.
 * @return  the json representation of the result
 */
string eval_result::json()
{
    std::stringstream ss;
    ss << "{ ";
    if (WIFEXITED(code))
        ss << "\"exit\": " << WEXITSTATUS(code) << ", ";
    if (WIFSIGNALED(code))
        ss << "\"signal\": " << WTERMSIG(code) << ", ";
    ss << "\"memory\": " << mem << ", ";
    ss << "\"utime\": " << utime << ", ";
    ss << "\"stime\": " << stime << ", ";
    ss << "\"rtime\": " << rtime << " }";
    return string(ss.str());
}

pid_t eval::Child;

/**
 * Display the usage of the program.
 */
void eval::show_usage()
{
    throw "usage: eval [-help] [-stdin path] [-stdout path] [-stderr path] [-time time_limit] [-mem memory_limit]";
}

/**
 * Restrict the maximum memory the process to be evaluated can use.
 * @param n memory in bytes
 */
void eval::enforce_mem_limit(rlim_t n)
{
    if (!n) return;
    n += 16 * 1024 * 1024 + n / 8;
    rlimit t;
    t.rlim_cur = n;
    t.rlim_max = n;
    setrlimit(RLIMIT_AS, &t);
    setrlimit(RLIMIT_DATA, &t);
}

/**
 * Restrict the maximum running time of the process to be evaluated.
 * @param n time in microseconds
 */
void eval::enforce_time_limit(size_t n)
{
    if (!n) return;
    itimerval t;
    n = n * 3 / 2;
    t.it_interval.tv_sec = t.it_interval.tv_usec = 0;
    t.it_value.tv_sec = n / 1000000;
    t.it_value.tv_usec = n % 1000000;
    setitimer(ITIMER_REAL, &t, NULL);
}

/**
 * Parse the given arguments and apply these settings.
 * @param argv the arguments array to parse
 */
void eval::parse_args(char ** argv)
{
    for (char ** p = argv; *p; ++p)
        for (char * s = *p; *s; ++s)
            *s = tolower(*s);

    parser p;
    p.add("-help", [&](const string & s, const vector<string> & v) {
        show_usage();
    }, 0, 0);

    auto redirect = [&](const string & s, const vector<string> & v) {
        (s == "-stderr" ? stderr_s : s == "-stdout" ? stdout_s : stdin_s) = v[0];
    };
    p.add("-stderr", redirect, 1, 1);
    p.add("-stdout", redirect, 1, 1);
    p.add("-stdin", redirect, 1, 1);

    p.add("-time", [&](const string & s, const vector<string> & v) {
        int n; sscanf(v[0].c_str(), "%zu%n", &time_limit, &n);
        if (n <= 0)
            throw "invalid time limit";
        const char * p = v[0].c_str() + n;
        if (strcmp(p, "s") == 0)
            time_limit *= 1000000;
        else if (!*p || strcmp(p, "ms") == 0)
            time_limit *= 1000;
        else if (strcmp(p, "us") != 0)
            throw "invalid time unit (must be s/ms/us)";
    }, 1, 1);

    p.add("-mem", [&](const string & s, const vector<string> & v) {
        int n; sscanf(v[0].c_str(), "%zu%n", &mem_limit, &n);
        if (n <= 0)
            throw "invalid memory limit";
        const char * p = v[0].c_str() + n;
        if (!*p || strcmp(p, "m") == 0 || strcmp(p, "mb") == 0)
            mem_limit *= M;
        else if (strcmp(p, "k") == 0 || strcmp(p, "kb") == 0)
            mem_limit *= K;
        else if (strcmp(p, "g") == 0 || strcmp(p, "gb") == 0)
            mem_limit *= G;
        else if (strcmp(p, "b") != 0)
            throw "invalid memory unit (must be b/k/kb/m/mb/g/gb)";
    }, 1, 1);

    p.parse(rem, argv);
}

/**
 * Signal handler. Kills the child process when triggered.
 * @param sig
 */
void eval::signal_handler(int sig)
{
    kill(Child, SIGKILL);
}

/**
 * Redirect the specified file descriptor in the current process.
 * @param s the path to the new file
 * @param wr_mode true for write, false for read
 * @param fd file descriptor to replace
 */
void eval::redirect(const char * s, bool wr_mode, int fd)
{
    if (*s) {
        int r = wr_mode ? open(s, O_WRONLY | O_CREAT | O_TRUNC, 0644) :
                open(s, O_RDONLY);
        if (r == -1 || dup2(r, fd) == -1)
            exit(1);
    }
}

/**
 * Redirect all the built in file descriptors in the child process.
 */
void eval::redirect_child()
{
    redirect(stderr_s.c_str(), true, STDERR_FILENO);
    redirect(stdout_s.c_str(), true, STDOUT_FILENO);
    redirect(stdin_s.c_str(), false, STDIN_FILENO);
}

/**
 * Compute the difference of two timespec objects.
 * @param a the first timespec
 * @param b the second timespec
 * @return a - b
 */
timespec eval::tspec_diff(const timespec & a, const timespec & b)
{
    timespec r;
    if (a.tv_nsec < b.tv_nsec) {
        r.tv_nsec = a.tv_nsec + 1000000000 - b.tv_nsec;
        r.tv_sec = a.tv_sec - b.tv_sec - 1;
    }
    else {
        r.tv_nsec = a.tv_nsec - b.tv_nsec;
        r.tv_sec = a.tv_sec - b.tv_sec;
    }
    return r;
}

/**
 * Helper function that convers a timespec into milliseconds.
 * @param t the timespec to convert
 * @return time in milliseconds
 */
size_t eval::tspec_to_ms(const timespec & t)
{
    return t.tv_nsec / 1000000 + t.tv_sec * 1000;
}

/**
 * Helper function that convers a timeval into milliseconds.
 * @param t the timeval to convert
 * @return time in milliseconds
 */
size_t eval::tval_to_ms(const timeval & t)
{
    return t.tv_sec * 1000 + t.tv_usec / 1000;
}

/**
 * Helper function that generates that argv array given to exec.
 * @return the arguments array
 */
char ** eval::get_argv()
{
    if (rem.empty())
        throw "nothing to execute";
    size_t n = rem.size();
    char ** p = new char *[n + 1];
    for (size_t i = 0; i < n; ++i) {
        p[i] = strdup(rem[i].c_str());
    }
    p[n] = nullptr;
    return p;
}

/**
 * Run the evaluation and generate the result.
 * @return
 */
eval_result eval::operator () ()
{
    signal(SIGALRM, SIG_DFL);
    signal(SIGALRM, signal_handler);

    if (!(Child = fork())) {
        enforce_mem_limit(mem_limit);
        redirect_child();
        char ** argv = get_argv();
        execv(*argv, argv);
        exit(1);
    }
    else {
        enforce_time_limit(time_limit);
        timespec t1; clock_gettime(CLOCK_MONOTONIC, &t1);
        int n; waitpid(Child, &n, 0);
        timespec t2; clock_gettime(CLOCK_MONOTONIC, &t2);

        timespec d = tspec_diff(t2, t1);
        rusage t; getrusage(RUSAGE_CHILDREN, &t);
        eval_result r;
        r.mem = t.ru_maxrss;
        r.rtime = tspec_to_ms(d);
        r.utime = tval_to_ms(t.ru_utime);
        r.stime = tval_to_ms(t.ru_stime);
        r.code = n;

        return r;
    }
}

/**
 * Initializer, sets the default values.
 */
void eval::initialize()
{
    time_limit = mem_limit = 0;
}

/**
 * Constructor, parse the given arguments.
 * @param argv arguments
 */
eval::eval(char ** argv)
{
    initialize();
    parse_args(argv);
}