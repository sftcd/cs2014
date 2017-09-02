
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
- Object files
- One issue about efficiency
- Documentation (doxygen, not sure how relevant, but leads to useful thoughts)
- Coding styles such as [Mozilla's](https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/Coding_Style)
- Performance (running ```time c-prog-2/rbtest 60000``` vs. ```time c-prog-1/rndbytes 60000```) 
