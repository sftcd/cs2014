
#C++ Program Examples#1

These are some C++ program examples from my course on systems 
programming (<a href="https://down.dsg.cs.tcd.ie/cs2014">CS2014</a>),
the canonical URL for this is 
<a href="https://down.dsg.cs.tcd.ie/cs2014/examples/c++-1/README.html">here</a>.

##Files in this example:

- README.md - this file in markdown format
- README.html - this file, in HTML format (```'make html'``` to update that from .md)
- [Makefile](Makefile) - to build the example and HTML (there's a clean target too)
- [hw.cpp](hw.cpp) - a version of hello world
- [ref.cpp](ref.cpp) - a crappy C++ trick to avoid

After running ```'make'``` then these files will be produced (if all
goes well):

- README.html - the html version of README.md
- hw - the hello world binary

##Hello World

[This](hw.cpp) is the canonical first C program pretty much everyone
has written for decades, but this time in C++. ([Here's](https://www.thesoftwareguild.com/blog/the-history-of-hello-world/)
some history, if you're interested.

And here's the code:

		#include <iostream>
		using namespace std;

		int main()
		{
			cout << "Hello World!\n";
			return(0);
		}

Let's go through it line-by-line since there are so few lines...

		#include <iostream>
		using namespace std;

'C++' header files can also use use the ```.h```
file extension, and ```make``` and Makefiles know how to handle all that. 

Anyway, on we go...

		int main()
		{
			...
		}

Every C++ program needs a ```main()``` function, same as for C.

The body of our one and only function has two statements,
the first being...

			cout << "Hello World!";

This is the meat of the program (slim pickings, eh!) and calls
the standard ```cout``` object with one argument, that
is the string we want to print. Note that the ```\n``` there
means "add a new line when printing."

And finally, since we said ```main()``` would return an 
integer result we better do that to be nice and tidy:

			return(0);


###C++ Details:

- A nicely terse [tutorial](http://joule.bu.edu/~hazen/progr/cppcen.html), so good I have a [local copy](cppcen.html) 
- some [slideware](https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-s096-introduction-to-c-and-c-january-iap-2013/lectures-and-assignments/)




