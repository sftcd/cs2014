# This is the Makefile for CS2014 c-progs examples

# markdown stuff
MDCMD=markdown_py 
# make sure -f is last
MDOPTS=-f

# debug version
CC=gcc -g

# non-debug version
#CC=gcc

all: html hw

hw: hw.c

doc: hw hw-dox refman.pdf

refman.pdf:
	doxygen hw-dox
	cd latex;make;cp refman.pdf ..

hw-dox:
	doxygen -g hw-dox

html: README.html

clean:
	@rm -f hw 
	@rm -rf latex html

reallyclean: clean
	@rm -f README.html hw-dox refman.pdf

%.html: %.md
	$(MDCMD) $(MDOPTS) $(@) $(<) 
