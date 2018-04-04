# This is the Makefile for CS2014 sample exam

# markdown stuff
MDCMD=markdown_py 
# make sure -f is last
MDOPTS=-f

CC=g++ -g -fsanitize=address

all: html dnsparse mainfsize mainfsize_pp badcat middlingbad lessbadcat

fsize.o: fsize.h fsize.c

mainfsize.o: fsize.h mainfsize.c

mainfsize: fsize.o mainfsize.o

mainfsize_pp.o: fsize.h mainfsize_pp.cpp

mainfsize_pp: fsize.o mainfsize_pp.o

clean:
	@rm -f *.o mainfsize mainfsize_pp badcat
	@rm -f badcat middlingbad lessbadcat
	@rm -f dnsparse


html: README.html

reallyclean: clean
	@rm -f README.html

%.html: %.md
	$(MDCMD) $(MDOPTS) $(@) $(<) 
