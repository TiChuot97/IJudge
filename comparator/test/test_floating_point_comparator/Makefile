SRC = ../../src
INC = -I$(SRC)
CC = g++
CFLAGS = -lgtest $(INC)
OBJDIR = ../../bin
TARGET = test_floating_point_comparator
OBJ = $(OBJDIR)/floating_point_comparator.o $(OBJDIR)/comparator.o $(OBJDIR)/utility.o

all: $(TARGET)

$(TARGET): $(TARGET).cpp $(OBJ)
	$(CC) $(CFLAGS) $(INC) -o $(TARGET) $(TARGET).cpp $(OBJ)

