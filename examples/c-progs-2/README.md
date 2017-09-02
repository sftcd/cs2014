
#C Program Examples#2

These are some C program examples from my course on systems 
programming (<a href="https://down.dsg.cs.tcd.ie/cs2014">CS2014</a>),
the canonical URL for this is 
<a href="https://down.dsg.cs.tcd.ie/cs2014/examples/c-progs-2/README.html">here</a>.

##Files in this example:

- README.md - this file in markdown format
- README.html - this file, in HTML format (```'make html'``` to update that from .md)
- [Makefile](Makefile) - to build the example and HTML (there's a clean target too)
- [rndbytes.c](rndbytes.c) - a couple of wee utility fuctions to get stuff from ```/dev/random```
- [rndbytes.h](rndbytes.h) - header for those functions
- [rbtest.c](rbtest.c) - ```main()``` that calls functions from ```rndbytes.h```

After running ```'make'``` then these files will be produced (if all
goes well):

- README.html - the html version of README.md
- rndbytes.o - the rndbytes object file
- rbtest - the rndbytes test program

##A More Structured ```rndbytes.c``` setup

This iteration of the ```rndbytes``` example demonstrates a bunch of 
things that we'll talk about in class:

- Making a header file
- Object files and the build
- Documentation (via doxygen, not sure how relevant, but leads to useful thoughts)
- Coding styles such as [Mozilla's](https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/Coding_Style)
- Performance (running ```time c-prog-2/rbtest 60000``` vs. ```time c-prog-1/rndbytes 60000```) 

## Header file

Here's the source:

		/*!
		 * @file rndbytes.h
		 * @brief This is the external i/f for the rndbytes example
		 * 
		 * This is part of CS2014
		 *    https://down.dsg.cs.tcd.ie/cs2014/examples/c-progs-2/README.html
		 */

		/* 
		 * Copyright (c) 2017 stephen.farrell@cs.tcd.ie
		 * 
		 * Permission is hereby granted, free of charge, to any person obtaining a copy
		 * of this software and associated documentation files (the "Software"), to deal
		 * in the Software without restriction, including without limitation the rights
		 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		 * copies of the Software, and to permit persons to whom the Software is
		 * furnished to do so, subject to the following conditions:
		 * 
		 * The above copyright notice and this permission notice shall be included in
		 * all copies or substantial portions of the Software.
		 * 
		 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
		 * THE SOFTWARE.
		 *
		 */

		/*!
		 * @brief produce a random byte
		 * @return the random byte
		 *
		 * Get me a random byte from /dev/random 
		 *
		 */
		unsigned char rndbyte();

		/*!
		 * @brief fill a buffer with random bytes
		 * @param buf an allocated buffer of at least the required size 
		 * @param buflen the number of random bytes to insert into the buffer
		 * @return zero for success, nonzero for error
		 *
		 * Fill me buffer with randoms.
		 *
		 */
		int rndbytes(unsigned char* buf,int buflen);

Noteworthy:
- doxygen header @ top and before function prototypes
- function prototypes, one we've seen and one we've not 
- memory management of ```buf``` parameter of ```rndbytes```

## The Makefile

The significant part of the Makefile is below...

		all: html rbtest

		rbtest: rbtest.c rndbytes.o rndbytes.h

		rndbytes.o: rndbytes.c rndbytes.h

		doc: rbtest rnd-dox latex/refman.pdf
			doxygen rnd-dox

		latex/refman.pdf:
			cd latex;make

		rnd-dox:
			doxygen -g rnd-dox

		html: README.html

		clean:
			@rm -f rbtest rndbytes.o 
			@rm -rf latex html

		reallyclean: clean
			@rm -f README.html rnd-dox 

		%.html: %.md
			$(MDCMD) $(MDOPTS) $(@) $(<) 


## Built-in documentation

There are varying opinions as to whether and how to best document
your code. Those vary from "don't include any comments" to schemes
for generating code from "documentation." [refs needed]


