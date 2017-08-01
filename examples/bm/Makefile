# This is the Makefile for CS2014 bm example

# markdown stuff
MDCMD=markdown_py 
# make sure -f is last
MDOPTS=-f

# debug version
#CC=gcc -g

# non-debug version
CC=gcc

all: broken-malloc html

broken-malloc: broken-malloc.c broken-malloc.h

html: README.html

clean:
	@rm -f broken-malloc a.out p1.c

reallyclean: clean
	@rm -f README.html

%.html: %.md
	$(MDCMD) $(MDOPTS) $(@) $(<) 
