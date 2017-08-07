# This is the Makefile for CS2014 examples

# markdown stuff
MDCMD=markdown_py 
# make sure -f is last
MDOPTS=-f

all: html

html: README.html

%.html: %.md
	$(MDCMD) $(MDOPTS) $(@) $(<) 
