#include "word_comparator.hpp"

using namespace std;

/**
 * Construct a general comparator with given 2 files.
 */
WordComparator::WordComparator(const char * file1, const char * file2): Comparator(file1, file2)
{}

/**
 * Destructor.
 */
WordComparator::~WordComparator() {}

/**
 * Read all the words from given file.
 */
void WordComparator::getWords(vector <string> &words, const char * file) {
    fstream fs;
    fs.open(file, fstream::in);

	string newWord;

	while (fs >> newWord) 
		words.push_back(newWord);

	fs.close();
}

/**
 * Compare two words. Return 0 if two words are identical.
 * Return -1 if the first word is lexicographically less
 * than the second word. Return 1 otherwise.
 */
int WordComparator::compareWords(string word1, string word2) {
	int len = min(word1.length(), word2.length());

	for (int index = 0; index < len; ++index) {
		if (word1[index] < word2[index]) return -1;
		if (word1[index] > word2[index]) return 1;
	}
	
	if (word1.length() < word2.length())
		return -1;
	if (word1.length() > word2.length())
		return 1;
	return 0;
}

/**
 * Compare the two files word-by-word.
 * Return true if the two files are 
 * identical, false otherwise.
 */
bool WordComparator::compareFiles() {
	vector <string> wordsFile1;
	vector <string> wordsFile2;
	getWords(wordsFile1, file1);
	getWords(wordsFile2, file2);

	int index = 0;
	int index1 = 0;
	int index2 = 0;
	while (index1 < wordsFile1.size() || index2 < wordsFile2.size()) {
		++index;
		string word1 = "";
		string word2 = "";

		if (index1 < wordsFile1.size())
			word1 = wordsFile1[index1++];

		if (index2 < wordsFile2.size())
			word2 = wordsFile2[index2++];

		_result[index] = compareWords(word1, word2);

		if (_result[index])
			_identical = false;
	}
	return _identical;
}


/**
 * Print the result in raw data.
 */
void WordComparator::plainTextPrint() {
	map <int, int>::iterator it;
	for (it = _result.begin(); it != _result.end(); ++it) 
		cout << it->first << " " << it->second << endl;
}

/**
 * Print the result in verbose format.
 */
void WordComparator::verbosePrint() {
	if (_identical) 
		cout << "IDENTICAL" << endl;
	else {
		cout << "DIFFERENT" << endl;
		
		map <int, int>::iterator it;
		for (it = _result.begin(); it != _result.end(); ++it) 
			if (it->second) 
				cout << "Different at words number " << it->first << endl;
	}
}


/**
 * Print the result in JSON format.
 * Return the JSON string.
 */
string WordComparator::JSONPrint() {
	string JSONres = "";
	JSONres.push_back('{');
	JSONres.push_back(' ');

	map <int, int>::iterator it;
	for (it = _result.begin(); it != _result.end(); ++it) {
		JSONres = JSONres + to_string(it->first) + ": ";
		JSONres = JSONres + to_string(it->second) + ", ";
	}

	JSONres.pop_back();
	JSONres.pop_back();
	JSONres.push_back(' ');
	JSONres.push_back('}');

	cout << JSONres << endl;

	return JSONres;
}
