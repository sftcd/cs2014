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
#CC=gcc
CC=gcc -g

# the name of our executable result
program_NAME := cs2014-coin
# the names of our 'C' source files - in this case all .c files in this dir
program_C_SRCS := $(wildcard *.c)
# the names of our object files - in this case all .o files here, derived from .c files
program_C_OBJS := ${program_C_SRCS:.c=.o}
program_OBJS := $(program_C_OBJS) 
# "special" includes, in this case mbed TLS
program_INCLUDE_DIRS := ../assignment2/mbedtls-2.6.0/include
# "special" library dirs, in this case mbed TLS
program_LIBRARY_DIRS := ../assignment2/mbedtls-2.6.0/library
# "special" libraries , in this case mbed TLS
# careful here - the order matters!
program_LIBRARIES := mbedcrypto mbedtls   
# Standard name for compiler options
CFLAGS += $(foreach includedir,$(program_INCLUDE_DIRS),-I$(includedir))
# Standard name for linker options
LDFLAGS += $(foreach librarydir,$(program_LIBRARY_DIRS),-L$(librarydir))
LDFLAGS += $(foreach library,$(program_LIBRARIES),-l$(library))
# you might need this if you build the mbedtls library with deugging symbols included
# LDFLAGS += -lgcov

all: cs2014-coin

html: README.html

# PHONY targets mean there'll be no trouble even if have a file called "clean" etc.
.PHONY: all clean distclean

# our default target
all: $(program_NAME)

# our default dependecies - build rule is derived
$(program_NAME): $(program_OBJS)
	$(CC) $(program_OBJS) $(LDFLAGS) -o $(program_NAME)

doc: $(program_NAME) rnd-dox refman.pdf

refman.pdf:
	doxygen rnd-dox
	cd latex;make;cp refman.pdf ..

rnd-dox:
	doxygen -g rnd-dox

clean:
	@- $(RM) $(program_NAME)
	@- $(RM) $(program_OBJS)

distclean: clean 

reallyclean: clean
	@- $(RM) README.html
	@- $(RM) refman.pdf
	@- $(RM) -rf latex html

%.html: %.md
	$(MDCMD) $(MDOPTS) $(@) $(<) 

