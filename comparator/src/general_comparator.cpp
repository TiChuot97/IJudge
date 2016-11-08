#include "general_comparator.hpp"

using namespace std;

/**
 * Construct a general comparator with given 2 files.
*/
GeneralComparator::GeneralComparator(const char * file1, const char * file2):
    Comparator(file1, file2),
    _removeExtraSpaces(false),
    _removeLeadingSpaces(false),
    _removeTrailingSpaces(false),
    _removeBlankLines(false),
    _removeLeadingBlankLines(false),
    _removeTrailingBlankLines(false)
{}

/**
 * Destructor.
 */
GeneralComparator::~GeneralComparator() {}

/**
 * Remove the spaces of a line if needed.
 */
string GeneralComparator::filterSpaces(string line) {
    string resultLine = "";
    int len = line.size();
    bool isLeadingSpaces = _removeLeadingSpaces || _removeExtraSpaces;

    for (int index = 0; index < len; ++index) {
        char nextChar = line[index];

        // Check if we need to remove leading spaces
        if (nextChar == ' ' && isLeadingSpaces)
            continue;
        isLeadingSpaces = false;

        // Check if we need to remove extra spaces
        if (resultLine.size() && resultLine[resultLine.size() - 1] == ' ' &&
            nextChar == ' ' && _removeExtraSpaces)
            continue;

        resultLine.push_back(line[index]);
    }

    // Check if we need to remove trailing spaces
    if (_removeTrailingSpaces || _removeExtraSpaces)
        while (resultLine.size() && resultLine[resultLine.size() - 1] == ' ')
            resultLine.pop_back();
    
    return resultLine;
}

/**
 * Get the lines from file with given flags.
 */
void GeneralComparator::getLines(vector < pair<string, int> > &lines, const char * file) {
    fstream fs;
    fs.open(file, fstream::in);

    int lineNum = 0;
    bool isLeadingBlankLines = true;
    string newLine;

    while (getline(fs, newLine)) {
        ++lineNum;

        newLine = filterSpaces(newLine);

        // Check if we need to remove leading blank lines
        if (newLine.length() == 0 && isLeadingBlankLines) 
            continue;
        isLeadingBlankLines = false;

        // Check if we need to remove blank lines
        if (_removeBlankLines && newLine.length() == 0)
            continue;

        lines.push_back(make_pair(newLine, lineNum));
    }

    // Check if we need to remove trailing blank lines
    if (_removeTrailingBlankLines)
        while (lines.size() > 0 && lines[lines.size() - 1].first.length() == 0)
            lines.pop_back();

    fs.close();
}

/**
 * Compare two different strings. Return the 0 if the two are
 * identical. Otherwise return the first position where the
 * difference occurs.
 */
int GeneralComparator::compareLines(string line1, string line2) {
	int len1 = line1.size();
	int len2 = line2.size();
	int len = min(len1, len2);

	for (int index = 0; index < len; ++index)
		if (line1[index] != line2[index])
			return (index + 1);

	if (len1 == len2) return 0;

	return (len + 1);
}

/**
 * Compare the two files.
 * Return true if the two files are 
 * identical, false otherwise.
 */
bool GeneralComparator::compareFiles() {
    vector < pair<string, int> > linesFile1;
    vector < pair<string, int> > linesFile2;
    getLines(linesFile1, file1);
    getLines(linesFile2, file2);

    int lineNum = 0;
    int index1 = 0;
    int index2 = 0;
    while (index1 < linesFile1.size() || index2 < linesFile2.size()) {
    	string line1 = "";
    	string line2 = "";
    	int lineNum1 = -1;
    	int lineNum2 = -1;

    	if (index1 < linesFile1.size()) {
    		line1 = linesFile1[index1].first;
    		lineNum1 = linesFile1[index1].second;
    		++index1;
    	}
    	if (index2 < linesFile2.size()) {
    		line2 = linesFile2[index2].first;
    		lineNum2 = linesFile2[index2].second;
    		++index2;
    	}
    	int position = compareLines(line1, line2);
    	map <string, int> newMap;
    	newMap["line1"] = lineNum1;
    	newMap["line2"] = lineNum2;
    	newMap["position"] = position;
    	_result[lineNum++] = newMap;

    	if (position)
    		_identical = false;
    }

    return _identical;
}

/**
 * Print the result in raw data.
 */
void GeneralComparator::plainTextPrint() {
	map<int, map<string, int> >::iterator it;

	for (it = _result.begin(); it != _result.end(); ++it) {
		cout << (it->second)["line1"] << " ";
		cout << (it->second)["line2"] << " ";
		cout << (it->second)["position"] << endl;
	}
}

/**
 * Print the result in verbose format.
 */
void GeneralComparator::verbosePrint() {
	if (_identical) {
		cout << "IDENTICAL" << endl;
	}
	else {
		cout << "DIFFERENT" << endl;

		map<int, map<string, int> >::iterator it;
		bool isDifferentLength = false;

		for (it = _result.begin(); it != _result.end(); ++it) {
			if ((it->second)["line1"] == -1 || (it->second)["line2"] == -1) {
				isDifferentLength = true;
				continue;
			}
			cout << "Line " << (it->second)["line1"] << " in file 1 ";
			cout << "and corresponding line " << (it->second)["line2"] << " in file 2 ";
			cout << "different at position " << (it->second)["position"] << endl;
		}

		if (isDifferentLength)
			cout << "Two files are of different length!!!" << endl;
	}
}

/**
 * Print the result in JSON format.
 * Return the JSON string.
 */
string GeneralComparator::JSONPrint() {
	string JSONres = "";
	JSONres.push_back('{');
	JSONres.push_back(' ');

	map<int, map<string, int> >::iterator it;

	for (it = _result.begin(); it != _result.end(); ++it) {
		JSONres = JSONres + to_string(it->first) + ": { ";
		JSONres = JSONres + "line1: " + to_string((it->second)["line1"]) + ", ";
		JSONres = JSONres + "line2: " + to_string((it->second)["line2"]) + ", ";
		JSONres = JSONres + "position: " + to_string((it->second)["position"]) + " }, ";
	}

	// Delete the last ','
	JSONres.pop_back();
	JSONres.pop_back();

	JSONres.push_back(' ');
	JSONres.push_back('}');

	cout << JSONres << endl;

	return JSONres;
}

/**
 * Set optional flag to remove blank lines.
 */
void GeneralComparator::setRemoveBlankLines() {
	_removeBlankLines = true;
}

/**
 * Set optional flag to remove leading blank lines.
 */
void GeneralComparator::setRemoveLeadingBlankLines() {
	_removeLeadingBlankLines = true;
}

/**
 * Set optional flag to remove trailing blank lines.
 */
void GeneralComparator::setRemoveTrailingBlankLines() {
	_removeTrailingBlankLines = true;
}

/**
 * Set optional flag to remove spaces.
 */
void GeneralComparator::setRemoveSpaces() {
	_removeExtraSpaces = true;
}

/**
 * Set optional flag to remove leading spaces.
 */
void GeneralComparator::setRemoveLeadingSpaces() {
	_removeLeadingSpaces = true;
}

/**
 * Set optional flag to remove trailing spaces.
 */
void GeneralComparator::setRemoveTrailingSpaces() {
	_removeTrailingSpaces = true;
}
