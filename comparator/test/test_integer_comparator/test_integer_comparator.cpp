#include "integer_comparator.hpp"
#include <gtest/gtest.h>

TEST(IntegerComparator, IdenticalFiles) {
	IntegerComparator comparator("test_1A.txt", "test_1B.txt");
	bool result = comparator.compareFiles();
	ASSERT_EQ(result, true);
}

TEST(IntegerComparator, DifferentFiles) {
	IntegerComparator comparator("test_2A.txt", "test_2B.txt");
	bool result = comparator.compareFiles();
	ASSERT_EQ(result, false);
}

TEST(IntegerComparator, LeadingZeroFiles) {
	IntegerComparator comparator("test_3A.txt", "test_3B.txt");
	bool result = comparator.compareFiles();
	ASSERT_EQ(result, true);
}

TEST(IntegerComparator, NegativeNumberFiles) {
	IntegerComparator comparator("test_4A.txt", "test_4B.txt");
	bool result = comparator.compareFiles();
	ASSERT_EQ(result, true);
}

TEST(IntegerComparator, NegativeZeroFiles) {
	IntegerComparator comparator("test_5A.txt", "test_5B.txt");
	bool result = comparator.compareFiles();
	ASSERT_EQ(result, true);
}

TEST(IntegerComparator, ZeroFiles) {
	IntegerComparator comparator("test_6A.txt", "test_6B.txt");
	bool result = comparator.compareFiles();
	ASSERT_EQ(result, true);
}

int main(int argc, char * argv[]) {
	::testing::InitGoogleTest(&argc, argv);
	return RUN_ALL_TESTS();
}
