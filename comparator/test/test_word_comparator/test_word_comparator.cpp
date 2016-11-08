#include "word_comparator.hpp"
#include <gtest/gtest.h>

TEST(WordComparator, IdenticalFiles) {
	WordComparator comparator("test_1A.txt", "test_1B.txt");
	bool result = comparator.compareFiles();
	ASSERT_EQ(result, true);
}

TEST(WordComparator, DifferentFiles) {
	WordComparator comparator("test_2A.txt", "test_2B.txt");
	bool result = comparator.compareFiles();
	ASSERT_EQ(result, false);
}

int main(int argc, char * argv[]) {
	::testing::InitGoogleTest(&argc, argv);
	return RUN_ALL_TESTS();
}
