#include "floating_point_comparator.hpp"
#include "utility.hpp"

#include <iostream>
#include <cstring>
#include <fstream>

using namespace std;

/**
 * Print the instruction on how to use this program.
 */
void printUsage() {
	cout << "First argument: path to first file" << endl;
	cout << "Second argument: path to second file" << endl;
	cout << "Followed by optional flags:" << endl;
	cout << "	--print-verbose : print readable result" << endl;
	cout << "	--print-raw : print raw result" << endl;
	cout << "	--print-json : print result in json" << endl;
	cout << "	--absolute-error eps : compare files in absolute error mode with optional epsilon" << endl;
	cout << "	--relative-error eps : compare files in relative error mode with optional epsilon" << endl;
	cout << "If more than one print flag is set, the program will print in all mode in following order: verbose, raw, json." << endl;
	cout << "If no print flag is set, the program will print the result in verbose mode." << endl;
	cout << "If no epsilon is specified, the default epsilon is 10^(-6)" << endl;
	cout << "If no compare mode is specified, the default mode is absolute error" << endl;
}

bool printVerbose = false;
bool printRaw = false;
bool printJSON = false;

/**
 * Parse the input variables and set corresponding flags.
 */
bool setFlags(int argc, char * argv[], FloatingPointComparator &comparator) {
	int indexArg = 3;

	while (indexArg < argc) {
		char * arg = argv[indexArg];

		if (strcmp(arg, "--print-verbose") == 0)
			printVerbose = true;
		else if (strcmp(arg, "--print-raw") == 0)
			printRaw = true;
		else if (strcmp(arg, "--print-json") == 0)
			printJSON = true;
		else if (strcmp(arg, "--absolute-error") == 0) {
			if (indexArg + 1 < argc && isFloat(argv[indexArg + 1]))
				comparator.setEps(stod(argv[++indexArg]));
			comparator.setAbsoluteError();
		}
		else if (strcmp(arg, "--relative-error") == 0) {
			if (indexArg + 1 < argc && isFloat(argv[indexArg + 1])) 
				comparator.setEps(stod(argv[++indexArg]));
			comparator.setRelativeError();
		}
		else
			return false;

		++indexArg;
	}

	return true;
}

/**
 * Compare two files and print the result to stdout.
 */
int main(int argc, char * argv[]) {
	if (argc < 3) {
		printUsage();
		return 1;
	}

	if (!ifstream(argv[1]) || !ifstream(argv[2])) {
		cout << "File does not exist!!!" << endl;
		return 2;
	}

	FloatingPointComparator comparator = FloatingPointComparator(argv[1], argv[2]);

	if (!setFlags(argc, argv, comparator)) {
		cout << "Flag unknown!!!" << endl;
		printUsage();
		return 3;
	}

	comparator.compareFiles();

	if (!printVerbose && !printRaw && !printJSON)
		comparator.verbosePrint();
	if (printVerbose)
		comparator.verbosePrint();
	if (printRaw)
		comparator.plainTextPrint();
	if (printJSON)
		comparator.JSONPrint();
	return 0;
}
