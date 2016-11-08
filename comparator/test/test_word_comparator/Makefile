SRC = ../../src
INC = -I$(SRC)
CC = g++
CFLAGS = -lgtest $(INC)
OBJDIR = ../../bin
TARGET = test_word_comparator
OBJ = $(OBJDIR)/word_comparator.o $(OBJDIR)/comparator.o

all: $(TARGET)

$(TARGET): $(TARGET).cpp $(OBJ)
	$(CC) $(CFLAGS) $(INC) -o $(TARGET) $(TARGET).cpp $(OBJ)

