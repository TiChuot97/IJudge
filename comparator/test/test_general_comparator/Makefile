SRC = ../../src
INC = -I$(SRC)
CC = g++
CFLAGS = -lgtest $(INC)
OBJDIR = ../../bin
TARGET = test_general_comparator
OBJ = $(OBJDIR)/general_comparator.o $(OBJDIR)/comparator.o

all: $(TARGET)

$(TARGET): $(TARGET).cpp $(OBJ)
	$(CC) $(CFLAGS) $(INC) -o $(TARGET) $(TARGET).cpp $(OBJ)

