# This is the Makefile for CS2014 c-progs examples

# markdown stuff
MDCMD=markdown_py 
# make sure -f is last
MDOPTS=-f

# debug version
CC=gcc -g

# non-debug version
#CC=gcc

all: sizes html 

doc: sizes str-dox refman.pdf

refman.pdf: sizes
	doxygen str-dox
	cd latex;make;cp refman.pdf ..

str-dox:
	doxygen -g str-dox

html: README.html

clean:
	@rm sizes
	@rm -rf latex html 

reallyclean: clean
	@rm -f README.html str-dox refman.pdf

%.html: %.md
	$(MDCMD) $(MDOPTS) $(@) $(<) 
