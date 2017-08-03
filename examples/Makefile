# This is the Makefile for CS2014 examples

# markdown stuff
MDCMD=markdown_py 
# make sure -f is last
MDOPTS=-f

SUBDIRS = $(shell ls -d */)

all: html
	@for dir in $(SUBDIRS) ; do \
        make -C  $$dir ; \
	done


clean:
	@for dir in $(SUBDIRS) ; do \
        make -C  $$dir clean ; \
	done

html: README.html

%.html: %.md
	$(MDCMD) $(MDOPTS) $(@) $(<) 
