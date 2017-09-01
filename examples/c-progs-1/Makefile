# This is the Makefile for CS2014 c-progs examples

# markdown stuff
MDCMD=markdown_py 
# make sure -f is last
MDOPTS=-f

# debug version
CC=gcc -g

# non-debug version
#CC=gcc

all: html hw rndbytes rndbytes-borked

html: README.html

clean:
	@rm -f a.out hw rndbytes rndbytes-borked

reallyclean: clean
	@rm -f README.html

%.html: %.md
	$(MDCMD) $(MDOPTS) $(@) $(<) 
