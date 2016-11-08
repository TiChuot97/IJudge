#ifndef _WORD_COMPARATOR_H_
#define _WORD_COMPARATOR_H_

#include "comparator.hpp"
#include <cmath>
#include <iostream>
#include <string>
#include <vector>
#include <fstream>
#include <map>

using namespace std;

/**
 * This class implements a comparator which compares
 * two given files word-by-word. This means all blank
 * lines and redundant spaces are ignored.
 */
class WordComparator : public Comparator {
	public:

        /**
         * Construct a word comparator with given 2 files.
         */
        WordComparator(const char * file1, const char * file2);

		/**
		 * Destructor.
		 */
		~WordComparator();
		
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
         * Compare the two files word-by-word.
         */
        bool compareFiles();

	private:
		map <int, int> _result;

		/**
		 * Read all the words from given file.
		 */
		void getWords(vector <string> &words, const char * file);

		/**
		 * Compare two words. Return 0 if two words are identical.
		 * Return -1 if the first word is lexicographically less
		 * than the second word. Return 1 otherwise.
		 */
		int compareWords(string word1, string word2);
};

#endif
