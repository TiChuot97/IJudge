SRC = ../../src
INC = -I$(SRC)
CC = g++
CFLAGS = -lgtest $(INC)
OBJDIR = ../../bin
TARGET = test_integer_comparator
OBJ = $(OBJDIR)/integer_comparator.o $(OBJDIR)/comparator.o $(OBJDIR)/utility.o

all: $(TARGET)

$(TARGET): $(TARGET).cpp $(OBJ)
	$(CC) $(CFLAGS) $(INC) -o $(TARGET) $(TARGET).cpp $(OBJ)

