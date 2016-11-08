CC = g++
CFLAGS = -g -Wall -std=c++11
TARGET = general_compare word_compare floating_point_compare integer_compare
OBJDIR = ../bin

all: $(TARGET)

general_compare: $(OBJDIR)/general_compare.o $(OBJDIR)/general_comparator.o $(OBJDIR)/comparator.o
	$(CC) $(CFLAGS) $(OBJDIR)/general_compare.o $(OBJDIR)/general_comparator.o $(OBJDIR)/comparator.o -o general_compare

word_compare: $(OBJDIR)/word_compare.o $(OBJDIR)/word_comparator.o $(OBJDIR)/comparator.o
	$(CC) $(CFLAGS) $(OBJDIR)/word_compare.o $(OBJDIR)/word_comparator.o $(OBJDIR)/comparator.o -o word_compare

floating_point_compare: $(OBJDIR)/floating_point_compare.o $(OBJDIR)/floating_point_comparator.o $(OBJDIR)/comparator.o $(OBJDIR)/utility.o
	$(CC) $(CFLAGS) $(OBJDIR)/floating_point_compare.o $(OBJDIR)/floating_point_comparator.o $(OBJDIR)/comparator.o $(OBJDIR)/utility.o -o floating_point_compare

integer_compare: $(OBJDIR)/integer_compare.o $(OBJDIR)/integer_comparator.o $(OBJDIR)/comparator.o $(OBJDIR)/utility.o
	$(CC) $(CFLAGS) $(OBJDIR)/integer_compare.o $(OBJDIR)/integer_comparator.o $(OBJDIR)/comparator.o $(OBJDIR)/utility.o -o integer_compare 

$(OBJDIR)/%.o: %.cpp
	$(CC) $(CFLAG) -c $< -o $@

clean: 
	rm $(OBJDIR)/*.o $(TARGET)
