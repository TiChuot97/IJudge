#include "general_comparator.hpp"
#include <gtest/gtest.h>

TEST(GeneralComparator, IdenticalFiles) {
	GeneralComparator comparator("test_1A.txt", "test_1B.txt");
	bool result = comparator.compareFiles();
	ASSERT_EQ(result, true);
}

TEST(GeneralComparator, DifferentFiles) {
	GeneralComparator comparator("test_2A.txt", "test_2B.txt");
	bool result = comparator.compareFiles();
	ASSERT_EQ(result, false);
}

TEST(GeneralComparator, RemoveBlankLines) {
	GeneralComparator comparator("test_3A.txt", "test_3B.txt");
	comparator.setRemoveBlankLines();
	bool result = comparator.compareFiles();
	ASSERT_EQ(result, true);
}

TEST(GeneralComparator, RemoveLeadingBlankLines) {
	GeneralComparator comparator1("test_4A.txt", "test_4B.txt");
	comparator1.setRemoveLeadingBlankLines();
	bool result = comparator1.compareFiles();
	ASSERT_EQ(result, true);
	
	GeneralComparator comparator2("test_3A.txt", "test_3B.txt");
	comparator2.setRemoveLeadingBlankLines();
	result = comparator2.compareFiles();
	ASSERT_EQ(result, false);
}

TEST(GeneralComparator, RemoveTrailingBlankLines) {
	GeneralComparator comparator1("test_5A.txt", "test_5B.txt");
	comparator1.setRemoveTrailingBlankLines();
	bool result = comparator1.compareFiles();
	ASSERT_EQ(result, true);
	
	GeneralComparator comparator2("test_3A.txt", "test_3B.txt");
	comparator2.setRemoveTrailingBlankLines();
	result = comparator2.compareFiles();
	ASSERT_EQ(result, false);
}

TEST(GeneralComparator, RemoveSpaces) {
	GeneralComparator comparator("test_6A.txt", "test_6B.txt");
	comparator.setRemoveSpaces();
	bool result = comparator.compareFiles();
	ASSERT_EQ(result, true);

	GeneralComparator comparator1("test_7A.txt", "test_7B.txt");
	comparator1.setRemoveSpaces();
	comparator1.setRemoveBlankLines();
	result = comparator1.compareFiles();
	ASSERT_EQ(result, true);
}

TEST(GeneralComparator, RemoveLeadingSpaces) {
	GeneralComparator comparator("test_8A.txt", "test_8B.txt");
	comparator.setRemoveLeadingSpaces();
	bool result = comparator.compareFiles();
	ASSERT_EQ(result, true);

	GeneralComparator comparator1("test_6A.txt", "test_6B.txt");
	comparator1.setRemoveLeadingSpaces();
	result = comparator1.compareFiles();
	ASSERT_EQ(result, false);
}

TEST(GeneralComparator, RemoveTrailingSpaces) {
	GeneralComparator comparator("test_9A.txt", "test_9B.txt");
	comparator.setRemoveTrailingSpaces();
	bool result = comparator.compareFiles();
	ASSERT_EQ(result, true);

	GeneralComparator comparator1("test_6A.txt", "test_6B.txt");
	comparator1.setRemoveTrailingSpaces();
	result = comparator1.compareFiles();
	ASSERT_EQ(result, false);
}

int main(int argc, char * argv[]) {
	::testing::InitGoogleTest(&argc, argv);
	return RUN_ALL_TESTS();
}
