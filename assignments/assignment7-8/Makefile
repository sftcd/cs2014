# Copyright (C) 2017 Stephen Farrell, stephen.farrell@cs.tcd.ie
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.

# This is the Makefile for CS2014 assignment2
# See https://down.dsg.cs.tcd.ie/cs2014/asssignments/assignment2
# for instructions

# markdown stuff
MDCMD=markdown_py 
# make sure -f is last
MDOPTS=-f


# compiler/linker
# non-debug version
#CXX=g++ -Ofast
CXX=g++ -std=c++14 -g

all: html sendem checkoneandexit

# checkoneandexit install
c1ei: checkoneandexit
	# cp checkoneandexit /var/local/extra/as7/
	sudo cp checkoneandexit /usr/local/submitty/bin
	sudo chown root  /usr/local/submitty/bin/checkoneandexit
	sudo chgrp course_builders /usr/local/submitty/bin/checkoneandexit
	sudo chmod 555 /usr/local/submitty/bin/checkoneandexit

html: README.html

checkoneandexit: checkoneandexit.go
	go build checkoneandexit.go

sendem: sendem.go
	go build sendem.go

doc: rnd-dox refman.pdf sendem 

refman.pdf:
	doxygen rnd-dox
	cd latex;make;cp refman.pdf ..

rnd-dox:
	doxygen -g rnd-dox

# PHONY targets mean there'll be no trouble even if have a file called "clean" etc.
.PHONY: all clean distclean

clean:
	- rm -f sendem checkoneandexit

distclean: clean 

reallyclean: clean
	@- $(RM) README.html
	- rm -rf latex html refman.pdf

%.html: %.md
	$(MDCMD) $(MDOPTS) $(@) $(<) 

