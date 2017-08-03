# This is the Makefile for CS2014 shell example

# markdown stuff
MDCMD=markdown_py 
# make sure -f is last
MDOPTS=-f

# debug version
#CC=gcc -g

# non-debug version
CC=gcc

all: html

html: README.html

clean:
	@rm -f a.out

reallyclean: clean
	@rm -f README.html

%.html: %.md
	$(MDCMD) $(MDOPTS) $(@) $(<) 
