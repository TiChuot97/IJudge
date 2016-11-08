#include "floating_point_comparator.hpp"
#include <gtest/gtest.h>

TEST(FloatingPointComparator, AbsoluteIdenticalFiles) {
	FloatingPointComparator comparator("test_1A.txt", "test_1B.txt");
	bool result = comparator.compareFiles();
	ASSERT_EQ(result, true);
}

TEST(FloatingPointComparator, AbsoluteDifferentFiles) {
	FloatingPointComparator comparator("test_2A.txt", "test_2B.txt");
	bool result = comparator.compareFiles();
	ASSERT_EQ(result, false);
}

TEST(FloatingPointComparator, CustomAbsoluteFiles) {
	FloatingPointComparator comparator("test_3A.txt", "test_3B.txt");
	comparator.setEps(0.00001);
	bool result = comparator.compareFiles();
	ASSERT_EQ(result, false);

	FloatingPointComparator comparator1("test_1A.txt", "test_1B.txt");
	comparator1.setEps(0.00001);
	result = comparator1.compareFiles();
	ASSERT_EQ(result, true);
}

TEST(FloatingPointComparator, RelativeIdenticalFiles) {
	FloatingPointComparator comparator("test_4A.txt", "test_4B.txt");
	comparator.setRelativeError();
	bool result = comparator.compareFiles();
	ASSERT_EQ(result, true);
}

TEST(FloatingPointComparator, RelativeDifferentFiles) {
	FloatingPointComparator comparator("test_5A.txt", "test_5B.txt");
	comparator.setRelativeError();
	bool result = comparator.compareFiles();
	ASSERT_EQ(result, false);
}

TEST(FloatingPointComparator, CustomRelativeFiles) {
	FloatingPointComparator comparator("test_5A.txt", "test_5B.txt");
	comparator.setRelativeError();
	comparator.setEps(0.00001);
	bool result = comparator.compareFiles();
	ASSERT_EQ(result, true);

	FloatingPointComparator comparator1("test_6A.txt", "test_6B.txt");
	comparator1.setRelativeError();
	comparator1.setEps(0.00001);
	result = comparator1.compareFiles();
	ASSERT_EQ(result, false);
}

int main(int argc, char * argv[]) {
	::testing::InitGoogleTest(&argc, argv);
	return RUN_ALL_TESTS();
}
