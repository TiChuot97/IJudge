#include "comparator.hpp"

#include <string>
#include <iostream>

using namespace std;

/**
 * Construct a new comparator with given 2 files.
 */
Comparator::Comparator(const char * file1, const char * file2) : _identical(true) {
    this->file1 = file1;
    this->file2 = file2;
}

