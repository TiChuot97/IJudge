#include "floating_point_comparator.hpp"

using namespace std;

/**
 * Construct a general comparator with given 2 files.
 */
FloatingPointComparator::FloatingPointComparator(const char * file1, const char * file2) : 
	Comparator(file1, file2),
	_absoluteMode(true),
	_relativeMode(false),
	_sanityCheck(true),
	_eps(0.000001)
{}

/**
 * Destructor.
 */
FloatingPointComparator::~FloatingPointComparator() {}

/**
 * Get the real numbers from file.
 */
bool FloatingPointComparator::getDouble(vector <double> &doubles, const char * file) {
    fstream fs;
    fs.open(file, fstream::in);

	vector <string> input;
	string newNumber;

	while (fs >> newNumber) 
		input.push_back(newNumber);

	for (int index = 0; index < input.size(); ++index) {
		if (!isFloat(input[index]))
			return false;
		doubles.push_back(stod(input[index]));
	}

	fs.close();
	
	return true;
}

/**
 * Compare two given double with given mode.
 * Return 0 if two numbers are equal, 1 otherwise.
 */
int FloatingPointComparator::compareDouble(double double1, double double2) {
	if (_absoluteMode) {
		double diff = abs(double1 - double2);
		if (diff <= _eps)
			return 0;
		else 
			return 1;
	}
	else {
		double err = abs(double1 - double2) / abs(max(double1, double2));
		if (err <= _eps)
			return 0;
		else
			return 1;
	}
}

/**
 * Compare the two files.
 * Return true if the two files are 
 * identical, false otherwise.
 */
bool FloatingPointComparator::compareFiles() {
	vector <double> doubleFile1;
	vector <double> doubleFile2;
	bool checkInput1 = getDouble(doubleFile1, file1);
	bool checkInput2 = getDouble(doubleFile2, file2);

	if (!checkInput1 || !checkInput2) {
		_sanityCheck = false;
		_identical = false;
		return false;
	}
	
	int index = 1;
	int index1 = 0;
	int index2 = 0;

	while (index1 < doubleFile1.size() || index2 < doubleFile2.size()) {
		double double1 = 0;
		double double2 = 0;
		
		if (index1 == doubleFile1.size() || index2 == doubleFile2.size()) {
			_identical = false;
			_result[index++] = 1;
		}
		else {
			double1 = doubleFile1[index1++];
			double2 = doubleFile2[index2++];
			_result[index++] = compareDouble(double1, double2);
			if (_result[index - 1])
				_identical = false;
		}
	}

	return _identical;
}


/**
 * Set absolute error mode.
 */
void FloatingPointComparator::setAbsoluteError() {

	// Only one mode is active at a time
	_absoluteMode = true;
	_relativeMode = false;
}

/**
 * Set relative error mode.
 */
void FloatingPointComparator::setRelativeError() {

	// Only one mode is active at a time
	_absoluteMode = false;
	_relativeMode = true;
}

/**
 * Set the epsilon for comparison.
 */
void FloatingPointComparator::setEps(double eps) {
	_eps = eps;
}

/**
 * Print the result in raw data.
 */
void FloatingPointComparator::plainTextPrint() {
	if (!_sanityCheck) return;

	map <int, int>::iterator it;
	
	for (it = _result.begin(); it != _result.end(); ++it) 
		cout << it->first << " " << it->second << endl;
}

/**
 * Print the result in verbose format.
 */
void FloatingPointComparator::verbosePrint() {
	if (!_sanityCheck) {
		cout << "INVALID INPUT!!!" << endl;
		return;
	}

	if (_identical) 
		cout << "IDENTICAL" << endl;
	else
		cout << "DIFFERENT" << endl;

	map <int, int>::iterator it;
	
	for (it = _result.begin(); it != _result.end(); ++it) {
		cout << "Two numbers at position " << it->first;
		if (it->second)
			cout << " are different" << endl;
		else
			cout << " are equal" << endl;
	}
}

/**
 * Print the result in JSON format.
 * Return the JSON string.
 */
string FloatingPointComparator::JSONPrint() {
	if (!_sanityCheck) {
		string JSONres = "{}";
		cout << "{}" << endl;
		return JSONres;
	}

	string JSONres = "{ ";
	
	map <int, int>::iterator it;
	
	for (it = _result.begin(); it != _result.end(); ++it) {
		JSONres = JSONres + to_string(it->first) + ": ";
		JSONres = JSONres + to_string(it->second) + ", ";
	}

	JSONres.pop_back();
	JSONres.pop_back();
	JSONres += " }";

	cout << JSONres << endl;

	return JSONres;
}
