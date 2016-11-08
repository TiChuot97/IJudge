cmake_minimum_required(VERSION 3.6)
project(eval)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++14")

add_library(lib eval.cpp eval.h)
add_executable(eval main.cpp)
target_link_libraries(eval lib)
add_executable(tests tests.cpp)
target_link_libraries(tests lib)
add_executable(mem mem.cpp)
add_executable(forever forever.cpp)