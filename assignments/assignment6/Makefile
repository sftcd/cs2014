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

all: html 

html: README.html

# PHONY targets mean there'll be no trouble even if have a file called "clean" etc.
.PHONY: all clean distclean

clean:
	- rm -f knock

distclean: clean 

reallyclean: clean
	@- $(RM) README.html

%.html: %.md
	$(MDCMD) $(MDOPTS) $(@) $(<) 

