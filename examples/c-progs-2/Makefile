# This is the Makefile for CS2014 c-progs examples

# markdown stuff
MDCMD=markdown_py 
# make sure -f is last
MDOPTS=-f

# debug version
CC=gcc -g

# non-debug version
#CC=gcc

all: html rbtest

rbtest: rbtest.c rndbytes.o rndbytes.h

rndbytes.o: rndbytes.c rndbytes.h

doc: rbtest rnd-dox latex/refman.pdf
	doxygen rnd-dox

latex/refman.pdf:
	cd latex;make

rnd-dox:
	doxygen -g rnd-dox

html: README.html

clean:
	@rm -f rbtest rndbytes.o 
	@rm -rf latex html

reallyclean: clean
	@rm -f README.html rnd-dox 

%.html: %.md
	$(MDCMD) $(MDOPTS) $(@) $(<) 
