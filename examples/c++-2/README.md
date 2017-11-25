
#C++ Program Examples#2

These are some C++ program examples from my course on systems 
programming (<a href="https://down.dsg.cs.tcd.ie/cs2014">CS2014</a>),
the canonical URL for this is 
<a href="https://down.dsg.cs.tcd.ie/cs2014/examples/c++-2/README.html">here</a>.

##Files in this example:

- README.md - this file in markdown format
- README.html - this file, in HTML format (```'make html'``` to update that from .md)
- [Makefile](Makefile) - to build the example and HTML (there's a clean target too)
- [OptionHandler](OptionHandler/) - a directory with an option handler

After running ```'make'``` then these files will be produced (if all
goes well):

- README.html - the html version of README.md

###An option handler

As with C programming where we used ```getopt()``` we need something
for handling options nicely. [This](https://github.com/ryngonzalez/OptionHandler)
option handler (from [https://github.com/ryngonzalez](https://github.com/ryngonzalez))
seems useful to me and illustrates a few C++ design patterns.

- The [header](OptionHandler/option_handler.h) file
- An [example](OptionHandler/option_handler.h) program using that



