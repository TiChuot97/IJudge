#include "general_comparator.hpp"
#include <iostream>

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
	cout << "	--remove-blank : remove blank lines" << endl;
	cout << "	--remove-leading-blank : remove leading blank lines" << endl;
	cout << "	--remove-trailing-blank : remove trailing blank lines" << endl;
	cout << "	--remove-spaces : remove redundant spaces" << endl;
	cout << "	--remove-leading-spaces : remove leading spaces" << endl;
	cout << "	--remove-trailing-spaces : remove trailing spaces" << endl;
	cout << "If more than one print flag is set, the program will print in all mode in following order: verbose, raw, json." << endl;
	cout << "If no print flag is set, the program will print the result in verbose mode." << endl;
}

bool printVerbose = false;
bool printRaw = false;
bool printJSON = false;

/**
 * Parse the input variables and set corresponding flags.
 */
bool setFlags(int argc, char * argv[], GeneralComparator &comparator) {
	for (int indexArg = 3; indexArg < argc; ++indexArg) {
		char * arg = argv[indexArg];

		if (strcmp(arg, "--print-verbose") == 0)
			printVerbose = true;
		else if (strcmp(arg, "--print-raw") == 0)
			printRaw = true;
		else if (strcmp(arg, "--print-json") == 0)
			printJSON = true;
		else if (strcmp(arg, "--remove-blank") == 0)
			comparator.setRemoveBlankLines();
		else if (strcmp(arg, "--remove-leading-blank") == 0)
			comparator.setRemoveLeadingBlankLines();
		else if (strcmp(arg, "--remove-trailing-blank") == 0)
			comparator.setRemoveTrailingBlankLines();
		else if (strcmp(arg, "--remove-spaces") == 0)
			comparator.setRemoveSpaces();
		else if (strcmp(arg, "--remove-leading-spaces") == 0)
			comparator.setRemoveLeadingSpaces();
		else if (strcmp(arg, "--remove-trailing-spaces") == 0)
			comparator.setRemoveTrailingSpaces();
		else
			return false;
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

	GeneralComparator comparator = GeneralComparator(argv[1], argv[2]);

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
