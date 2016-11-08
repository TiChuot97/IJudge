#ifndef _INTEGER_COMPARATOR_H_
#define _INTEGER_COMPARATOR_H_

#include "comparator.hpp"
#include "utility.hpp"
#include <string>
#include <iostream>
#include <fstream>
#include <map>

/**
 * This class implements a comparator which compares
 * two given files which contain only big integers
 */
class IntegerComparator : Comparator {
	public:
		
        /**
         * Construct a general comparator with given 2 files.
         */
		IntegerComparator(const char * file1, const char * file2);

		/**
		 * Destructor.
		 */
		~IntegerComparator();
		
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

	private:
		bool _sanityCheck;

		/**
		 * Remove leading zeros.
		 */
		string filterLeadingZero(string number);

		/**
		 * Get the integers from files. If the
		 * input are invalid, returns false.
		 * Otherwise, return true.
		 */
		bool getInt(vector <string> &ints, const char * file);

		/**
		 * Compare two big integers. Return -1 if the
		 * first one is less than the second one. Return
		 * 1 if the first one is larger than the second
		 * one. Return 0 if two numbers are equal.
		 */
		int compareInt(string int1, string int2);

		map <int, int> _result;
};

#endif
