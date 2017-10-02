# This is the Makefile for CS2014 c-progs examples

# markdown stuff
MDCMD=markdown_py 
# make sure -f is last
MDOPTS=-f

# debug version
CC=gcc -g

# non-debug version
#CC=gcc

all: html

html: README.html

clean:

%.html: %.md
	$(MDCMD) $(MDOPTS) $(@) $(<) 

