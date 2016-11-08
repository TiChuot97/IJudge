#ifndef _GENERAL_COMPARATOR_H_
#define _GENERAL_COMPARATOR_H_

#include "comparator.hpp"
#include <string>
#include <utility>
#include <cstdio>
#include <cmath>
#include <iostream>
#include <fstream>
#include <vector>
#include <map>

using namespace std;

/**
 * This class implements a comparator which compares
 * two given files with following options:
 * 	- Ignoring blank lines
 * 	- Ignoring leading blank lines
 * 	- Ignoring trailing blank lines
 * 	- Ignoring spaces
 * 	- Ignoring leading spaces
 * 	- Ignoring trailing spaces
 */
class GeneralComparator : public Comparator {
    public:

        /**
         * Construct a general comparator with given 2 files.
         */
        GeneralComparator(const char * file1, const char * file2);

		/**
		 * Destructor.
		 */
		~GeneralComparator();

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
         * Set optional flag to remove blank lines.
         */
        void setRemoveBlankLines();

        /**
         * Set optional flag to remove leading blank lines.
         */
        void setRemoveLeadingBlankLines();

        /**
         * Set optional flag to remove trailing blank lines.
         */
        void setRemoveTrailingBlankLines();

        /**
         * Set optional flag to remove spaces.
         */
        void setRemoveSpaces();

        /**
         * Set optional flag to remove leading spaces.
         */
        void setRemoveLeadingSpaces();

        /**
         * Set optional flag to remove trailing spaces.
         */
        void setRemoveTrailingSpaces();

    private:

        // Flags for spaces and blank lines removing
        bool _removeExtraSpaces;
        bool _removeLeadingSpaces;
        bool _removeTrailingSpaces;
        bool _removeBlankLines;
        bool _removeLeadingBlankLines;
        bool _removeTrailingBlankLines;

        /**
         * Remove the spaces of a line if needed.
         */
        string filterSpaces(string line);

        /**
         * Get the lines from file with given flags.
         */
        void getLines(vector < pair<string, int> > &lines, const char * file);

        /**
         * Compare two different strings. Return the 0 if the two are
         * identical. Otherwise return the first position where the
         * difference occurs.
         */
        int compareLines(string line1, string line2);

        map <int, map<string, int> > _result;
};

#endif
