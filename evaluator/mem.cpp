#include <bits/stdc++.h>

using namespace std;

int main(int argc, char ** argv)
{
    if (argc <= 1)
        return 1;
    size_t n = atoi(argv[1]);
    size_t m = 1024 * 1024;
    for (size_t i = 0; i < n; ++i) {
        char *p = new char[m];
        fill(p, p + m, 'A');
    }
    return 0;
}
