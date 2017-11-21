<meta charset="utf-8" /> 

#C Program Examples: ```tree```

This is the ```tree``` program example which is part of my course on systems 
programming (<a href="https://down.dsg.cs.tcd.ie/cs2014">CS2014</a>),
the canonical URL for this is 
<a href="https://down.dsg.cs.tcd.ie/cs2014/examples/tree/README.html">here</a>.

##Files in this example:

- README.md - this file in markdown format
- README.html - this file, in HTML format (```'make html'``` to update that from .md)
- [Makefile](Makefile) - to build the example and HTML (there's a clean target too)
- The [```tree-1.7.0``` source code](./tree-1.7.0/) 

After running ```'make'``` then these files will be produced (if all
goes well):

- README.html - the html version of README.md



## The ```tree``` program...

```tree``` produces a recursive, decorated, directory listing.
It's a fairly old program (since ~1996) and I used to use it
long ago. It's interesting to us because:

- it uses a lot of system APIs
- it uses a lot of filesystem APIs
- it has some basic GUI stuff
- it's a real thing, not just a plaything
- it uses various C programming constructs that are worth knowing about

Note that there are many use-cases where a filesystem could have many
deeply-nested directories, each with many many files. For example,
a corporate or campus-wide server that creates files for each employee,
or a filesystem that contains a very large number of sharded files,
perhaps for storing user generated content (such as images or 
comments) in some web service. So 

The main repository for the code is at 
[```http://mama.indstate.edu/users/ice/tree/```](http://mama.indstate.edu/users/ice/tree/).
```tree``` is also part of the Ubuntu distribution as well, and claims to be the
same version we're looking at.

		$ which tree
		/usr/bin/tree
		$ /usr/bin/tree --version
		tree v1.7.0 (c) 1996 - 2014 by Steve Baker, Thomas Moore, Francesc Rocher, Florian Sesser, Kyosuke Tokoro 

Noteworthy:

- The program is probably older than a bunch of you! :-)
- Over time, maintainers change...

Let's first look at the output of ```tree``` when run in the source directory
for the program itself,
which is copied in this repo in ```$REPO/examples/tree/tree-1.7.0/```
We'll look at that both before and after running ```make```.
Note that we lose the colours here, in a shell you'd see those.

### The output of ```tree``` in it's source directory
		
		.
		├── CHANGES
		├── color.c
		├── doc
		│   ├── tree.1
		│   ├── tree.1.fr
		│   └── xml.dtd
		├── hash.c
		├── html.c
		├── INSTALL
		├── json.c
		├── LICENSE
		├── Makefile
		├── README
		├── strverscmp.c
		├── TODO
		├── tree.c
		├── tree.h
		├── unix.c
		└── xml.c
		
		1 directory, 18 files

Noteworthy:

- The [```INSTALL```](./tree-1.7.0/INSTALL) file tells you (a bit about) how to build/install
- The [```README```](./tree-1.7.0/README) has a nice set of acks - it costs very little to 
be nice, and it pays off over and over!
- The [```TODO```](./tree-1.7.0/TODO) file has some ideas for enhancements/fixes - it's
a good idea to have a place for such, in case someone does 'em for you, and to head off
many people suggesting the same (possibly bad) idea over and over.
- Today, we'd land this in github.com or gitlab.io and there'd be much more history information
available than there is here. There are actually a few github.com repos with this code,
(hey, including this one now:-), 
with various changes (but I didn't try check 'em all out).

## The [```Makefile```](./tree-1.7.0/Makefile)

If we look at the Makefile we see:

- A bunch of different OSes supported, but you need to uncomment the right
compiler options for your OS. Tools like ```automake``` exist to handle
that issue, but aren't used here. (And we won't cover that on this course,
it's too finickity;-)
- There's a default to build the ```tree``` exeecutable, and a clean target
- THere are also install, distcleana and dist targets which are typical
for packages one might distribute or install.
		
## Running ```make```

		$ cd $REPO/examples/tree/tree-1.7.0/
		$ make

		gcc -ggdb -Wall -DLINUX -D_LARGEFILE64_SOURCE -D_FILE_OFFSET_BITS=64 -c -o tree.o tree.c
		gcc -ggdb -Wall -DLINUX -D_LARGEFILE64_SOURCE -D_FILE_OFFSET_BITS=64 -c -o unix.o unix.c
		gcc -ggdb -Wall -DLINUX -D_LARGEFILE64_SOURCE -D_FILE_OFFSET_BITS=64 -c -o html.o html.c
		gcc -ggdb -Wall -DLINUX -D_LARGEFILE64_SOURCE -D_FILE_OFFSET_BITS=64 -c -o xml.o xml.c
		gcc -ggdb -Wall -DLINUX -D_LARGEFILE64_SOURCE -D_FILE_OFFSET_BITS=64 -c -o json.o json.c
		gcc -ggdb -Wall -DLINUX -D_LARGEFILE64_SOURCE -D_FILE_OFFSET_BITS=64 -c -o hash.o hash.c
		gcc -ggdb -Wall -DLINUX -D_LARGEFILE64_SOURCE -D_FILE_OFFSET_BITS=64 -c -o color.o color.c
		color.c: In function ‘cmd’:
		color.c:236:3: warning: this ‘for’ clause does not guard... [-Wmisleading-indentation]
		   for(i=0;cmds[i].cmdnum;i++)
		   ^~~
		color.c:238:5: note: ...this statement, but the latter is misleadingly indented as if it is guarded by the ‘for’
		     if (s[0] == '*') return DOT_EXTENSION;
		     ^~
		color.c: In function ‘initlinedraw’:
		color.c:490:7: warning: this ‘for’ clause does not guard... [-Wmisleading-indentation]
		       for(s=linedraw->name;*s;++s)
		       ^~~
		color.c:492:2: note: ...this statement, but the latter is misleadingly indented as if it is guarded by the ‘for’
		  return;
		  ^~~~~~
		gcc  -o tree tree.o unix.o html.o xml.o json.o hash.o color.o
		$

The warnings are all pretty much the same, let's look at the first one,
in [```color.c```](./tree-1.7.0/color.c) at line 236:

		  for(i=0;cmds[i].cmdnum;i++)
		    if (!strcmp(cmds[i].cmd,s)) return cmds[i].cmdnum;
		    if (s[0] == '*') return DOT_EXTENSION;
		    return ERROR;

We can see that only the second line above is iterated, the 3rd and fourt
are not. How to tell if that's significant?

To build the ```tree``` binary, go into the source directory and run ```make```.

## After ```make```

		.
		├── CHANGES
		├── color.c
		├── color.o
		├── doc
		│   ├── tree.1
		│   ├── tree.1.fr
		│   └── xml.dtd
		├── hash.c
		├── hash.o
		├── html.c
		├── html.o
		├── INSTALL
		├── json.c
		├── json.o
		├── LICENSE
		├── Makefile
		├── README
		├── strverscmp.c
		├── TODO
		├── tree
		├── tree.c
		├── tree.h
		├── tree.o
		├── unix.c
		├── unix.o
		├── xml.c
		└── xml.o
		
		1 directory, 26 files


## Counting lines of code

```cloc``` is a utility that counts various lines of code. I wouldn't take it too
seriously (not all lines of code are equal) but it does give an overall feel for
the size of a project and the kinds of source file inovlved.

		user@host:~/code/cs2014/examples/tree/tree1.7.0$ cloc .
      		18 text files.
      		14 unique files.                              
       		6 files ignored.
		
		github.com/AlDanial/cloc v 1.70  T=0.07 s (163.3 files/s, 54907.2 lines/s)
		-------------------------------------------------------------------------------
		Language                     files          blank        comment           code
		-------------------------------------------------------------------------------
		C                                8            325            320           2737
		Forth                            1             13              8            214
		C/C++ Header                     1             18             36            137
		DTD                              1              1              0            116
		make                             1             22             59             30
		-------------------------------------------------------------------------------
		SUM:                            12            379            423           3234
		-------------------------------------------------------------------------------


## [```tree.h```](./tree-1.7.0/tree.h)

There's only 1 header file that has all the definitions and function prototypes used.
One could argue that one header file per C file might be better, but for a codebase
of this size, that's probably not a big deal. 

The current structure also means that
since pretty much all function prototypes are in one header, the actual code can
be in nearly any place.

Noteworthy:

- Clear copyright (GPLv2 in this case) - good!
- Lots of ```#include``` directives, as you'd expect for a tool like this
- A few ```#ifdef``` directives for different OSes - also quite typical for a thing like this
that's been on lots of platforms and depends on system libraries.
- ```#ifndef TRUE...``` - imposing local style!
- There's a ```#ifdef``` within the definition of the ```_info``` struct - so the
size of such structures will be OS dependent - possible source of bugs, if you're
not careful.

### Linked lists and (of course) trees...

Given what this is doing, it's fairly obvious that the code needs
to be able to discover and then process nested lists of things (files
in the filesystem) without knowing in advance how many there are of
each (kind of) thing. Leads us naturally to linked lists, and we
find those here.

The ```_info``` struct has loads of fields (as there are lots of 
possible attributes of a thing you find in the filesystem) but
boils down to...

		struct _info {
		  char *name;
		  // more fields
		  struct _info **child;
		};

This is saying, that an instance of the ```_info``` struct, can
contain an array of pointers to other instances of ```_info```
structs. Just as we'd expect, for a tree!

There's a lot of coding history about processing linked lists.
It's a fairly typical standard exam question:-)

### Two useful links...

This [tutorial](http://www.c4learn.com/data-structure/introduction-to-linked-list-c-programming/)
on linked lists isn't bad.

This page describes [memory layout](http://www.geeksforgeeks.org/memory-layout-of-c-program/) for 'C' programs nicely.


### Function pointers

[```tree.c```](./tree-1.7.0/tree.c) contains the following:

		off_t (*listdir)(char *, int *, int *, u_long, dev_t) = unix_listdir;
		int (*cmpfunc)() = alnumsort;

These are function pointers. Just as you can define a pointer to
a structure, you can define a pointer to a function. This can be
handy when you have a bunch of different ways to do the same
thing - in this case, providing terminal, html, json etc. output - based
on the same data structure. Then you can instantiate the function
pointer according to the given command line arguments and the
calling code doesn't need to branch based on the command line
arguments, so saving code.

This mechanism can be a bit opaque though, so is likely best
avoided by you, for now. (Unless some cruel person forces you to
do it for an assignment:-) Function pointers are fairly often used when encoding
and decoding structured data that has some built-in extensibility
mechanism, such as when dealing with various protocols.

[This](https://www.cprogramming.com/tutorial/function-pointers.html) page
explains the concepts well enough that I won't cut'n'paste the text 
here. (So we'll go there for details.)

### External variables

[```tree.c```](./tree-1.7.0/tree.c) 
uses various global variables that
are declared in other files, those need to be (re-)declared as ```extern``` 
variables in the file that uses them, so for example, in 
[```tree.c```](./tree-1.7.0/tree.c) we see:

		/* Externs */
		/* hash.c */
		extern struct xtable *gtable[256], *utable[256];
		extern struct inotable *itable[256];
		/* color.c */
		extern bool colorize, ansilines, linktargetcolor;
		extern char *leftcode, *rightcode, *endcode;
		extern const struct linedraw *linedraw;

And for example in 
[```hash.c```](./tree-1.7.0/hash.c) 
we see:

		struct xtable *gtable[256], *utable[256];


### A wrapper for malloc

```xmalloc()``` just wraps ```malloc()``` very simply but on failure
(when out of memory), prints to ```stderr``` and calls ``exit(1)```
which is just fine for a command line tool, but wouldn't work for
a library function. In this case, that saves lots of lines of
error checking code, as when we run out of memoery, we just
fail hard and exit the entire program.

Doing your own wrapper for ```malloc()``` isn't that uncommon,
for various reasons, e.g. you might want to be sure memory is
initialised to zero (ala ```calloc()```), or you might want
to randomly fail (didn't we see that before?:-), or you might
want to put in magic markers to help you debug things in
some way.








