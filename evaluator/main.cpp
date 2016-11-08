#include "eval.h"
#include <iostream>

using namespace std;

int main(int argv, char ** argc)
{
    eval f(argc + 1);
    try {
        auto r = f();
        cout << r.json() << endl;
    }
    catch(const char * s) {
        std::cout << s << std::endl;
        return 0;
    }
    return 0;
}