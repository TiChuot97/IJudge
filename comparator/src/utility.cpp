#include "utility.hpp"

using namespace std;

/**
 * Check if a number is a valid real number.
 */
bool isFloat(string input) {
	static regex pattern("(-|\\+)?(([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))((e|E)[0-9]+)?");
	return regex_match(input, pattern);
}

/**
 * Check if a number is a valid integer.
 */
bool isInt(std::string input) {
	int index = 0;
	
	if (input[0] == '-')
		++index;
	
	while (index < input.length()) {
		if (input[index] < '0' || input[index] > '9') 
			return false;
		++index;
	}

	return true;
}
