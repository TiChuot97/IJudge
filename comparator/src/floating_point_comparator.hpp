#ifndef _FLOATING_POINT_COMPARATOR_H_
#define _FLOATING_POINT_COMPARATOR_H_

#include "comparator.hpp"
#include "utility.hpp"

#include <iostream>
#include <string>
#include <fstream>
#include <cmath>
#include <map>

using namespace std;

/**
 * This class implements a comparator which compares
 * two given files which contain only real numbers
 * This class also support the comparison in two 
 * following mode:
 * 	- Absolute error (default error is 10^(-6))
 * 	- Relative error (default error is 10^(-6))
 */
class FloatingPointComparator : public Comparator {
    public:

        /**
         * Construct a floating point comparator with given 2 files.
         */
        FloatingPointComparator(const char * file1, const char * file2);

		/**
		 * Destructor.
		 */
		~FloatingPointComparator();

        /**
         * Print the result in raw data.
         */
        void plainTextPrint();

        /**
         * Print the result in verbose format.
         */
        void verbosePrint();

       /**
         * Print the result in JSON format.
		 * Return the JSON string.
         */
        string JSONPrint();

		/**
		 * Compare the two files.
		 * Return true if the two files are 
		 * identical, false otherwise.
		 */
        bool compareFiles();

		/**
		 * Set absolute error mode.
		 */
		void setAbsoluteError();

		/**
		 * Set relative error mode.
		 */
		void setRelativeError();

		/**
		 * Set the epsilon for comparison.
		 */
		void setEps(double eps);

    private:

		// Flags to indicate which mode for comparison
		bool _absoluteMode;
		bool _relativeMode;
		bool _sanityCheck;

		double _eps;

		/**
		 * Get the real numbers from file.
		 */
		bool getDouble(vector <double> &doubles, const char * file);

		/**
		 * Check if the input is a valid real number. 
		 * Return true if input is a valid real number,
		 * false otherwise.
		 */
		bool sanityCheck(string input);

		/**
		 * Compare two given double with given mode.
		 * Return 0 if two numbers are equal, 1 otherwise.
		 */
		int compareDouble(double double1, double double2);

        map <int, int> _result;
};

#endif
