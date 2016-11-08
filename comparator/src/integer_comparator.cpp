#include "integer_comparator.hpp"

using namespace std;

/**
 * Construct a general comparator with given 2 files.
 */
IntegerComparator::IntegerComparator(const char * file1, const char * file2):
	Comparator(file1, file2),
	_sanityCheck(true)
{}

/**
 * Destructor.
 */
IntegerComparator::~IntegerComparator() {}

/**
 * Remove leading zeros.
 */
string IntegerComparator::filterLeadingZero(string number) {
	bool isLeadingZero = true;
	string newNumber = "";
	
	for (int index = 0; index < number.length(); ++index) {
		if (number[index] == '0' && isLeadingZero)
			continue;
		newNumber.push_back(number[index]);
		if (number[index] != '0' && number[index] != '-')
			isLeadingZero = false;
	}

	if (newNumber == "-" || newNumber == "")
		newNumber = "0";

	return newNumber;
}

/**
 * Get the integers from files. If the
 * input are invalid, returns false.
 * Otherwise, return true.
 */
bool IntegerComparator::getInt(vector <string> &ints, const char * file) {
    fstream fs;
    fs.open(file, fstream::in);

	string newNumber = "";

	while (fs >> newNumber) {
		if (!isInt(newNumber)) 
			return false;
		newNumber = filterLeadingZero(newNumber);
		ints.push_back(newNumber);
	}

    fs.close();

	return true;
}

/**
 * Compare two big integers. Return -1 if the
 * first one is less than the second one. Return
 * 1 if the first one is larger than the second
 * one. Return 0 if two numbers are equal.
 */
int IntegerComparator::compareInt(string int1, string int2) {
	if (int1[0] == '-' && int2[0] != '-') return -1;
	if (int1[0] != '-' && int2[0] == '-') return 1;

	if (int1.length() != int2.length()) {
		if (int1[0] == '-') {
			if (int1.length() > int2.length()) 
				return -1;
			else 
				return 1;
		}
		else {
			if (int1.length() < int2.length())
				return -1;
			else
				return 1;
		}
	}

	for (int index = 0; index < int1.length(); ++index) {
		if (int1[index] > int2[index]) return 1;
		if (int1[index] < int2[index]) return -1;
	}

	return 0;
}

/**
 * Compare the two files.
 * Return true if the two files are 
 * identical, false otherwise.
 */
bool IntegerComparator::compareFiles() {
	vector <string> intFile1;
	vector <string> intFile2;
	bool checkInput1 = getInt(intFile1, file1);
	bool checkInput2 = getInt(intFile2, file2);

	if (!checkInput1 || !checkInput2) {
		_sanityCheck = false;
		_identical = false;
		return false;
	}

	int index = 1;
	int index1 = 0;
	int index2 = 0;

	while (index1 < intFile1.size() || index2 < intFile2.size()) {

		if (index1 == intFile1.size()) {
			_result[index++] = -1;
			++index2;
			continue;
		}

		if (index2 == intFile2.size()) {
			_result[index++] = 1;
			++index1;
			continue;
		}
		
		int compareRes = compareInt(intFile1[index1++], intFile2[index2++]);
		_result[index++] = compareRes;

		if (compareRes)
			_identical = false;
	}

	return _identical;
}

/**
 * Print the result in raw data.
 */
void IntegerComparator::plainTextPrint() {
	if (!_sanityCheck) return;

	map <int, int>::iterator it;

	for (it = _result.begin(); it != _result.end(); ++it)
		cout << it->first << " " << it->second << endl;
}

/**
 * Print the result in verbose format.
 */
void IntegerComparator::verbosePrint() {
	if (!_sanityCheck) {
		cout << "INVALID INPUT" << endl;
		return;
	}

	if (_identical)
		cout << "IDENTICAL" << endl;
	else
		cout << "DIFFERENT" << endl;

	map <int, int>::iterator it;

	for (it = _result.begin(); it != _result.end(); ++it) {
		cout << "Position " << it->first << ": ";
		cout << "Number in file 1 ";
		if (it->second == 0)
			cout << "equals ";
		if (it->second < 0)
			cout << "is less than ";
		if (it->second > 0)
			cout << "is greater than ";
		cout << "number in file 2" << endl;
	}
}

/**
 * Print the result in JSON format.
 * Return the JSON string.
 */
string IntegerComparator::JSONPrint() {
	if (!_sanityCheck) {
		string JSONres = "{}";
		cout << JSONres << endl;
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
