
#C Program Examples

These are the C program examples from my course on systems 
programming (<a href="https://down.dsg.cs.tcd.ie/cs2014">CS2014</a>),
the canonical URL for this is 
<a href="https://down.dsg.cs.tcd.ie/cs2014/examples/c-progs/README.html">here</a>.

##Files in this example:

- README.md - this file in markdown format
- README.html - this file, in HTML format (```'make html'``` to update that from .md)
- Makefile - to build the example and HTML (there's a clean target too)
- [hw.c](hw.c) - a version of hellow world
- [stdio.h](stdio.h) - a copy of the most standard header file

After running ```'make'``` then this file will be produced (if all
goes well):

- hw - the hello world binary

##Hello World

[This](hw.c) is the canonical first C program pretty much everyone
has written for decades. ([Here's](https://www.thesoftwareguild.com/blog/the-history-of-hello-world/)
some history, if you're interested.

And here's the code:

		#include <stdio.h>
		
		int main()
		{
			printf("Hello World!\n");
		}

Let's go through it line-by-line since there are so few lines...

		#include <stdio.h> 

The C preprocessor command ```#include``` says to add in the content of a
header file. 'C' header files are traditionally (and usefully) use the ```.h```
file extension, and ```make``` and Makefiles know how to handle that. (More
on ```make``` in a bit.)

The C preprocessor is basically a program run before compilation that 
expands macros/preprocessor directives and then feeds the resulting
expanded code into the compiler.
Note that the C preprocessor isn't really part of the C language and
could be used for other things.
Most C preprocessor commands start with a ```#``` character, and we already
saw the ```#define``` command in our earlier [broken malloc](../bm/README.html) 
example. Since the [Wikipedia page](https://en.wikipedia.org/wiki/C_preprocessor)
for this is plenty good enough for our purposes, we'll head over there for
more on preprocessor directives. (And hope nobody's crapped on the page
in the meantime:-) The [GNU](https://gcc.gnu.org/onlinedocs/gcc-2.95.3/cpp_1.html)
page is maybe more officially better, but not particularly readable.

The main preprocessor directives we want learn to use properly in this course are:

		#include
		#define
		#ifdef 	
		#else 
		#endif 

We'll explain those as we come to them. In this case ```#include <stdio.h>```
says to replace that line with the contents of the file ```stdio.h```. The
angle-brackets ```<>``` say to to look for that file in the standard known
places where the operating system keeps standard header files. In this
case, ```stdio.h``` is probably going to be in the ```/usr/include```
directory but that varies from system to system. 

[Here's](stdio.h) a local copy of that from my system we can look at.

If you wanted to write and include your own header file, say called
```myownheaderfile.h``` then you'd probably have that in the same
directory as ```hw.c``` and would use quote characters instead of
angle brackets to signal the preprocessor to look in the current
directory like this:

		#include "myownheaderfile.h"

Note that, in contrast to C language statements we don't end the
preprocessor directives with a semi-colon (since the preprocessor
directive ins't a C language statement). 

Using quotes like that isn't really great practice in a bigger
project though, it's mostly better to extend the standard 
search path for header files to include the directories where
you keep those, and stick with the angle brackets. That helps
if you're using multiple object files in a single executable,
or if you're building a library - more on both of those later
in the course.

GOT HERE

		int main()
		{
			printf("Hello World!\n");
		}


		
