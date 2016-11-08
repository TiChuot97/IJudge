#ifndef EVAL_EVAL_H
#define EVAL_EVAL_H

#include <cstddef>
#include <string>
#include <vector>
#include <sys/time.h>
#include <sys/resource.h>
#include <sys/wait.h>
#include <unistd.h>
#include <fcntl.h>
#include <dirent.h>
#include <sstream>
#include <iostream>

class eval_result
{
public:
    std::size_t mem, stime, rtime, utime;
    int code;

    std::string verbose();
    std::string plain();
    std::string json();
};

class eval
{
private:
    static pid_t Child;
    static const size_t K = 1024, M = K * K, G = K * M;
    size_t time_limit, mem_limit;
    std::string stderr_s, stdout_s, stdin_s;
    std::vector<std::string> rem;

    void initialize();
    void redirect(const char *, bool, int);
    void redirect_child();
    void parse_args(char **);
    void enforce_mem_limit(rlim_t);
    void enforce_time_limit(size_t n);
    char ** get_argv();
    static void signal_handler(int);
    static timespec tspec_diff(const timespec &, const timespec &);
    static size_t tspec_to_ms(const timespec &);
    static size_t tval_to_ms(const timeval &);

public:
    void show_usage();
    eval_result operator () ();
    eval(char **);
};

#endif
