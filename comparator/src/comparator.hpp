#ifndef _COMPARATOR_H_
#define _COMPARATOR_H_

#include <map>
#include <string>
#include <vector>

using namespace std;

class Comparator {
    public:
        
        /**
         * Construct a new comparator with given 2 files.
         */
        Comparator(const char * file1, const char * file2);

        /**
         * Compare the two files.
         */
        virtual bool compareFiles() = 0;

        /**
         * Print the result in JSON format. At the
         * same time return a JSON string of the result.
         */
        virtual string JSONPrint() = 0;

        /**
         * Print the result in verbose format.
         */
        virtual void verbosePrint() = 0;

        /**
         * Print the raw data in plain text.
         */
        virtual void plainTextPrint() = 0;   
    
    protected:
        const char * file1;  	// Path to the first file
        const char * file2; 	// Path to the second file

        bool _identical; 	 	// Result of comparison
};

#endif
