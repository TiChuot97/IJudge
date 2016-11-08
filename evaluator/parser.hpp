#ifndef EVAL_PARSER_HPP
#define EVAL_PARSER_HPP

#include <vector>
#include <functional>
#include <string>
#include <unordered_map>
#include <cstddef>

class parser
{
private:
    using string = std::string;
    template <class T>
    using vector = std::vector<T>;
    using func = std::function<void(const string &, const vector<string> &)>;;

    class entry
    {
    public:
        size_t min, max;
        func callback;

        /**
         * Constructor.
         * @param ptr the callback function
         * @param min the minimum number of arguments
         * @param max the maximum number of arguments
         */
        template <class T>
        entry(const T & fun, size_t min, size_t max) :
                min(min), max(max)
        {
            callback = fun;
        }
    };

    std::unordered_map<string, entry> map;

public:


    /**
      * Add an option to the parser. The supplied callback function will be called with [min, max] arguments collected.
      * @param s the option to register
      * @param callback  the callback function
      * @param min the minimum number of arguments the option takes
      * @param max  the maximum number of arguments the option takes
      */
    template <class T>
    void add(const string & s, const T & callback, size_t min, size_t max)
    {
        map.insert(std::make_pair(s, entry(callback, min, max < min ? min : max)));
    }

    /**
     * Remove an option from the parser.
     * @param s the option to remove
     */
    void remove(const string & s)
    {
        map.erase(s);
    }


    /**
      * Parse the given arguments.
      * @param res a vector that will be used to store all the unused arguments
      * @param begin the iterator of the first argument
      * @param end the iterator of the end of the argument list
      */
    template <class T>
    void parse(vector<string> & res, T begin, T end)
    {
        res.clear();
        vector<string> stk;
        auto nil = map.end(), last = nil;

        auto call = [&]() {
            last->second.callback(last->first, stk);
            stk.clear();
            last = nil;
        };

        auto dump = [&]() {
            if (last == nil) {
                for (auto & x : stk)
                    res.push_back(x);
                stk.clear();
            }
            else {
                if (stk.size() < last->second.min)
                    throw last->first;
                call();
            }
        };

        for (; begin != end; ++begin) {
            if (last != nil && stk.size() == last->second.max)
                call();
            string s(*begin);
            auto it = map.find(s);
            if (it == nil)
                stk.push_back(s);
            else {
                dump();
                last = it;
            }
        }
        dump();
    }

    /**
     * Parse the given arguments stored in C style arrays.
     * @param res a vector that will be used to store all the unused arguments
     * @param argv the array of arguments
     */
    void parse(vector<string> & res, char ** argv)
    {
        size_t n = 0;
        while (argv[n])
            ++n;
        parse(res, argv, argv + n);
    }
    /**
     * Prase the given arguments stored in a container.
     * @param res a vector that will be used to store all the unused arguments
     * @param v the array of arguments
     */
    template <class T>
    void parse(vector<string> & res, const T & v)
    {
        parse(res, v.cbegin(), v.cend());
    }
};

#endif