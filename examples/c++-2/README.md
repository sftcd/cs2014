
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

##An option handler

As with C programming where we used ```getopt()``` we need something
for handling options nicely. [This](https://github.com/ryngonzalez/OptionHandler)
option handler (from [https://github.com/ryngonzalez](https://github.com/ryngonzalez))
seems useful to me and illustrates a few C++ design patterns.

- The [header](OptionHandler/option_handler.h) file
- An [example](OptionHandler/option_handler.h) program using that

##What does this mean?

The first thing defined in OptionHandler is:

		class no_argument_for_required : public std::invalid_argument {
			public:
				no_argument_for_required(std::string option_name) :
				std::invalid_argument("REQUIRED option '" + option_name + "' without argument") {}
		};

That's saying that the new class being defined ```no_argument_for_required``` is derived
from the ```std::invalid_argument``` class and that the constructor for our new class
does nothing (the ```{}``` at the end) other than call the constructor of the
base class with a tailored string. The "call the base class constructor" is done
via the ```:``` and then the call to the base class constructor.

- See [here](https://stackoverflow.com/questions/2785612/c-what-does-the-colon-after-a-constructor-mean)
for an explanation.
- And see [here](http://www.cplusplus.com/reference/stdexcept/invalid_argument/) for documentation
of that base class (and other ```std::``` things).

The net result is to throw an exception with a tailored error message that the
exception catcher can then print.

##And there's an example program to use the ```Handler``` class...

That's in ```example.cpp```

Reading ```argc``` and ```argv``` into a vector is done as follows:

		Handler(int argc, char** argv) :
			input(std::vector<std::string>(argv + 1, argv + argc))
			{};

[This](https://stackoverflow.com/questions/6361606/save-argv-to-vector-or-string) describes
what's going on when constructing the Handler in the example code.

The rest is fairly obvious.

##Debugging

As with C programs, if you compile with -g you can debug with ```gdb```.

With C++ there can be more going on when you step through code in the debugger of course.


