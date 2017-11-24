# This is the Makefile for CS2014 c-progs examples

# markdown stuff
MDCMD=markdown_py 
# make sure -f is last
MDOPTS=-f

# debug version
CC=g++ -g -fsanitize=address

# non-debug version
#CC=g++

all: html hw ref 

html: README.html

clean:
	@rm -f a.out hw ref

reallyclean: clean
	@rm -f README.html

%.html: %.md
	$(MDCMD) $(MDOPTS) $(@) $(<) 
