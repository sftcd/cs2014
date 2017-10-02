
#C Program Examples#1

These are some C program examples from my course on systems 
programming (<a href="https://down.dsg.cs.tcd.ie/cs2014">CS2014</a>),
the canonical URL for this is 
<a href="https://down.dsg.cs.tcd.ie/cs2014/examples/c-progs-1/README.html">here</a>.

##Files in this example:

- README.md - this file in markdown format
- README.html - this file, in HTML format (```'make html'``` to update that from .md)
- [Makefile](Makefile) - to build the example and HTML (there's a clean target too)
- [stdio.h](stdio.h) - a copy of the most standard header file
- [hw.c](hw.c) - a version of hellow world
- [rndbytes-borked.c](rndbytes-borked.c) - a broken version of...
- [rndbytes.c](rndbytes.c) - a program to print bytes from ```/dev/random```

After running ```'make'``` then these files will be produced (if all
goes well):

- README.html - the html version of README.md
- hw - the hello world binary
- rndbytes - the rndbytes binary
- rndbytes-borked - guess what?

##Hello World

[This](hw.c) is the canonical first C program pretty much everyone
has written for decades. ([Here's](https://www.thesoftwareguild.com/blog/the-history-of-hello-world/)
some history, if you're interested.

And here's the code:

		#include <stdio.h>
		
		int main()
		{
			printf("Hello World!\n");
			return(0);
		}

Let's go through it line-by-line since there are so few lines...

		#include <stdio.h> 

The C preprocessor command ```#include``` says to add in the content of a
header file. 'C' header files are traditionally (and usefully) use the ```.h```
file extension, and ```make``` and Makefiles know how to handle that. (More
on ```make``` in a bit.)

The C preprocessor is basically a program run before compilation that 
eat comments and expands macros/preprocessor directives and then feeds the resulting
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
		#ifndef 	
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

Anyway, on we go...

		int main()
		{
			...
		}

Every C program needs a ```main()``` function, which as you'd
expect is what gets called when you execute the program that
the compiler produced from your source code. The braces ```{}```
mark the start and end of that function.

There are various *prototypes* for the ```main()``` function,
and which you use depends on whether or not you need to provide
input to ```main()``` (from the command line), so you could
see any of these:

		// the one we used 
		int main();
		// same meaning, just being explicit that no input is expected
		int main(void);
		
		// a common form when command line arguments are to be processed
		int main(int argc, char **argv);
		// identical to the previous one
		int main(int argc, char *argv[]);

There are some others, and some system-specific extensions but
the above are the most portable forms that are most commonly used.

In our case, we're saying that no comand line arguments will be
processed, and that the ```main()``` function will return an
integer, which can be used by the operating system to check if
how the executable exited, e.g. with success or failure.
Note that we can still provide arguments on the command line
but they'll just be ignored:

		$ ./hw
		Hello World!
		$ ./hw ignored arguments are pointless
		Hello World!
		$

And on we go...
		
The body of our one and only function has two statements,
the first being...

			printf("Hello World!\n");

This is the meat of the program (slim pickings, eh!) and calls
the standard ```printf()``` function with one argument, that
is the string we want to print. Note that the ```\n``` there
means "add a new line when printing."

And finally, since we said ```main()``` would return an 
integer result we better do that to be nice and tidy:

			return(0);

If you want to check the return value then the ```bash``
variable ```$?``` will display the result the the last
run command returned, so...

		$ ./hw
		Hello World!
		$ echo $?
		0
		$

So if we wanted a different return value, we could edit
```hw.c``` to return 22 so:

		$ cat hw.c
		#include <stdio.h>
		
		int main()
		{
			printf("Hello World!\n");
			return(22);
		}
		$ make
		gcc     hw.c   -o hw
		$ ./hw
		Hello World!
		$ echo $?
		22
		$


Note that the return value here is only an 8-bit value though, so ```$?```
will be whatever was provided to the ```return()``` call modulo 256.

## An example with a bug

We'll want to learn about [Debugging](http://courses.cms.caltech.edu/cs24/Debugging-1.pdf),
and use [GDB and valgrind](http://courses.cms.caltech.edu/cs24/Debugging-2.pdf) in a
while. (Those are from a [caltech course](http://courses.cms.caltech.edu/cs24/) which
seems pretty good, but has more than we need, and are used with permission - at least
I hope I get permission:-) 

So let's look at another example, but this time one that'll crash.

This example is intended to print out some random numbers. Unlike last time,
we want to use ```/dev/random``` as our source of randomness because we will
shortly use those randoms as a cryptographic key. (```rand()``` and buddies
aren't really good enough for that.)

Here's the code from [rndbytes-borked.c](rndbytes-borked.c) ... what's wrong with it?


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

		// usual includes
		#include <stdio.h>
		#include <stdlib.h>

		// needed for getting access to /dev/random
		#include <unistd.h>
		#include <sys/syscall.h>
		#include <linux/random.h>

		// the most we wanna print
		#define LIMIT 65536

		void usage(char *progname)
		{
			fprintf(stderr,"Print some random numbers from /dev/random.\n");
			fprintf(stderr,"Options:\n");
			fprintf(stderr,"\t%s <number> where number is the number of bytes to print [Default: 10, min: 0, max: %d]\n",progname,LIMIT);
			exit(-1);
		}

		unsigned char rndbyte()
		{
			unsigned long int s;
			syscall(SYS_getrandom, &s, sizeof(unsigned long int), 0);
			unsigned char byte=(s>>16)%256;
			return(byte);
		}

		int main(int argc,char *argv[])
		{
			int number;

			if (argc!=2) {
				number=atoi(argv[1]);
				if (number<=0) {
					fprintf(stderr,"%d too small\n",number);
					usage(argv[0]);
				}
				if (number>LIMIT) {
					fprintf(stderr,"%d too big\n",number);
					usage(argv[0]);
				}
			}


			for (int i=0;i!=number;i++) {
				unsigned char byte=rndbyte();
				printf("rnd%d: %02x\n",i,byte);
			}

			return(0);
		}

So let's try build that:

		$ make rndbytes-borked
		gcc -g     rndbytes-borked.c   -o rndbytes-borked
		
And now let's crash it:

		$./rndbytes-borked 
		Segmentation fault (core dumped)

Yuk! It crashed! Let's debug...
		
		gdb rndbytes-borked 
		GNU gdb (Ubuntu 7.12.50.20170314-0ubuntu1.1) 7.12.50.20170314-git
		Copyright (C) 2017 Free Software Foundation, Inc.
		License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
		This is free software: you are free to change and redistribute it.
		There is NO WARRANTY, to the extent permitted by law.  Type "show copying"
		and "show warranty" for details.
		This GDB was configured as "x86_64-linux-gnu".
		Type "show configuration" for configuration details.
		For bug reporting instructions, please see:
		<http://www.gnu.org/software/gdb/bugs/>.
		Find the GDB manual and other documentation resources online at:
		<http://www.gnu.org/software/gdb/documentation/>.
		For help, type "help".
		Type "apropos word" to search for commands related to "word"...
		Reading symbols from rndbytes-borked...done.
		(gdb) r
		Starting program: /home/stephen/Documents/tcd-other/cs2014/examples/c-progs-1/rndbytes-borked 
		
		Program received signal SIGSEGV, Segmentation fault.
		__GI_____strtol_l_internal (nptr=0x0, endptr=endptr@entry=0x0, base=base@entry=10, group=group@entry=0, loc=0x7ffff7dd2400 <_nl_global_locale>)
		    at ../stdlib/strtol_l.c:293
		293	../stdlib/strtol_l.c: No such file or directory.
		(gdb) bt
		#0  __GI_____strtol_l_internal (nptr=0x0, endptr=endptr@entry=0x0, base=base@entry=10, group=group@entry=0, loc=0x7ffff7dd2400 <_nl_global_locale>)
		    at ../stdlib/strtol_l.c:293
		#1  0x00007ffff7a4b642 in __strtol (nptr=<optimized out>, endptr=endptr@entry=0x0, base=base@entry=10) at ../stdlib/strtol.c:106
		#2  0x00007ffff7a471e0 in atoi (nptr=<optimized out>) at atoi.c:27
		#3  0x000055555555497e in main (argc=1, argv=0x7fffffffdeb8) at rndbytes-borked.c:58
		(gdb) f 3
		#3  0x000055555555497e in main (argc=1, argv=0x7fffffffdeb8) at rndbytes-borked.c:58
		58			number=atoi(argv[1]);
		(gdb) l
		53	int main(int argc,char *argv[])
		54	{
		55		int number;
		56	
		57		if (argc!=2) {
		58			number=atoi(argv[1]);
		59			if (number<=0) {
		60				fprintf(stderr,"%d too small\n",number);
		61				usage(argv[0]);
		62			}
		(gdb) 
		
A version of that that works as planned is in [rndbytes.c](rndbytes.c)
and is below...



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

		// usual includes
		#include <stdio.h>
		#include <stdlib.h>

		// needed for getting access to /dev/random
		#include <unistd.h>
		#include <sys/syscall.h>
		#include <linux/random.h>

		// the most we wanna print
		#define LIMIT 65536

		void usage(char *progname)
		{
			fprintf(stderr,"Print some random numbers from /dev/random.\n");
			fprintf(stderr,"Options:\n");
			fprintf(stderr,"\t%s <number> where number is the number of bytes to print [Default: 10, min: 0, max: %d]\n",progname,LIMIT);
			exit(-1);
		}

		unsigned char rndbyte()
		{
			unsigned long int s;
			syscall(SYS_getrandom, &s, sizeof(unsigned long int), 0);
			unsigned char byte=(s>>16)%256;
			return(byte);
		}

		int main(int argc,char *argv[])
		{
			int number=10;

			if (argc==2) {
				int newnumber=atoi(argv[1]);
				if (newnumber<=0) {
					fprintf(stderr,"%d too small\n",newnumber);
					usage(argv[0]);
				}
				if (newnumber>LIMIT) {
					fprintf(stderr,"%d too big\n",newnumber);
					usage(argv[0]);
				}
				number=newnumber;
			}


			for (int i=0;i!=number;i++) {
				unsigned char byte=rndbyte();
				printf("rnd%d: %02x\n",i,byte);
			}

			return(0);
		}

Noteworthy:

- show using ```gdb``` with that to break at the
call to ```rndbyte()``` and using ```p/x``` with ```s``` and
```byte``` locals so we can see what's up with the hex values.
- show stack frame info (```info f```) and the manual for that [here](http://web.mit.edu/gnu/doc/html/gdb_8.html)
- ```getrandom()``` isn't available in some current versions of
```glibc``` (see [this article](https://stackoverflow.com/questions/30800331/getrandom-syscall-in-c-not-found)
for more information - NB: some of that is misleading, you need to know how to figure that kind of thing out!) 
	- that article implies we can get what we need via ```syscall()``` - so show the output of ```man syscall```
	- the lesson there is to extract the wheat from the chaff, and then try things
	- note though that the code above is fairly brittle, I'd not like to depend on it on many different systems
- chat about shared objects/libraries: 
	- the ```ldd``` tool helps to figure out which 
[shared objects/libraries](http://tldp.org/HOWTO/Program-Library-HOWTO/shared-libraries.html) 
are used by a binary , e.g. 
	- to see which ```glibc``` version your system has use ```ldd --version```
		- ```ldd -v``` is verbose, and ```ldd -r``` is recursive
	- for our ```rndbytes``` binary, we get:

			$ ldd -v rndbytes
			linux-vdso.so.1 =>  (0x00007ffc04df1000)
			libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f1d68481000)
			/lib64/ld-linux-x86-64.so.2 (0x000055ec72b18000)
		
			Version information:
			./rndbytes:
				libc.so.6 (GLIBC_2.2.5) => /lib/x86_64-linux-gnu/libc.so.6
				libc.so.6 (GLIBC_2.4) => /lib/x86_64-linux-gnu/libc.so.6
			/lib/x86_64-linux-gnu/libc.so.6:
				ld-linux-x86-64.so.2 (GLIBC_2.3) => /lib64/ld-linux-x86-64.so.2
				ld-linux-x86-64.so.2 (GLIBC_PRIVATE) => /lib64/ld-linux-x86-64.so.2
			$ ldd -r rndbytes
			linux-vdso.so.1 =>  (0x00007ffc9cd5d000)
			libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f86ab961000)
			/lib64/ld-linux-x86-64.so.2 (0x000055d864c68000)



	- that shows that rndbytes is dynamically linked to glibc, the Ubuntu NetworkManager has
a few more dependencies, as you'd expect:

			$ ldd -r `which NetworkManager`	linux-vdso.so.1 =>  (0x00007ffee59d3000)
			libuuid.so.1 => /lib/x86_64-linux-gnu/libuuid.so.1 (0x00007fe4d8925000)
			libgnutls.so.30 => /usr/lib/x86_64-linux-gnu/libgnutls.so.30 (0x00007fe4d85c5000)
			libgmodule-2.0.so.0 => /usr/lib/x86_64-linux-gnu/libgmodule-2.0.so.0 (0x00007fe4d83c1000)
			libgudev-1.0.so.0 => /usr/lib/x86_64-linux-gnu/libgudev-1.0.so.0 (0x00007fe4d81b7000)
			libnl-3.so.200 => /lib/x86_64-linux-gnu/libnl-3.so.200 (0x00007fe4d7f97000)
			libsystemd.so.0 => /lib/x86_64-linux-gnu/libsystemd.so.0 (0x00007fe4d7f0d000)
			libndp.so.0 => /usr/lib/x86_64-linux-gnu/libndp.so.0 (0x00007fe4d7d07000)
			libm.so.6 => /lib/x86_64-linux-gnu/libm.so.6 (0x00007fe4d79fe000)
			libselinux.so.1 => /lib/x86_64-linux-gnu/libselinux.so.1 (0x00007fe4d77d6000)
			libsoup-2.4.so.1 => /usr/lib/x86_64-linux-gnu/libsoup-2.4.so.1 (0x00007fe4d74e9000)
			libgio-2.0.so.0 => /usr/lib/x86_64-linux-gnu/libgio-2.0.so.0 (0x00007fe4d7154000)
			libgobject-2.0.so.0 => /usr/lib/x86_64-linux-gnu/libgobject-2.0.so.0 (0x00007fe4d6eff000)
			libglib-2.0.so.0 => /lib/x86_64-linux-gnu/libglib-2.0.so.0 (0x00007fe4d6beb000)
			libdl.so.2 => /lib/x86_64-linux-gnu/libdl.so.2 (0x00007fe4d69e7000)
			libpthread.so.0 => /lib/x86_64-linux-gnu/libpthread.so.0 (0x00007fe4d67c9000)
			libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007fe4d6402000)
			/lib64/ld-linux-x86-64.so.2 (0x000055b0bd29b000)
			libz.so.1 => /lib/x86_64-linux-gnu/libz.so.1 (0x00007fe4d61e6000)
			libp11-kit.so.0 => /usr/lib/x86_64-linux-gnu/libp11-kit.so.0 (0x00007fe4d5f7f000)
			libidn.so.11 => /lib/x86_64-linux-gnu/libidn.so.11 (0x00007fe4d5d4c000)
			libtasn1.so.6 => /usr/lib/x86_64-linux-gnu/libtasn1.so.6 (0x00007fe4d5b39000)
			libnettle.so.6 => /usr/lib/x86_64-linux-gnu/libnettle.so.6 (0x00007fe4d5903000)
			libgmp.so.10 => /usr/lib/x86_64-linux-gnu/libgmp.so.10 (0x00007fe4d5683000)
			libhogweed.so.4 => /usr/lib/x86_64-linux-gnu/libhogweed.so.4 (0x00007fe4d5450000)
			libudev.so.1 => /lib/x86_64-linux-gnu/libudev.so.1 (0x00007fe4d542d000)
			librt.so.1 => /lib/x86_64-linux-gnu/librt.so.1 (0x00007fe4d5225000)
			liblzma.so.5 => /lib/x86_64-linux-gnu/liblzma.so.5 (0x00007fe4d4fff000)
			liblz4.so.1 => /usr/lib/x86_64-linux-gnu/liblz4.so.1 (0x00007fe4d4de7000)
			libgcrypt.so.20 => /lib/x86_64-linux-gnu/libgcrypt.so.20 (0x00007fe4d4ad7000)
			libpcre.so.3 => /lib/x86_64-linux-gnu/libpcre.so.3 (0x00007fe4d4864000)
			libxml2.so.2 => /usr/lib/x86_64-linux-gnu/libxml2.so.2 (0x00007fe4d44a8000)
			libsqlite3.so.0 => /usr/lib/x86_64-linux-gnu/libsqlite3.so.0 (0x00007fe4d41a1000)
			libgssapi_krb5.so.2 => /usr/lib/x86_64-linux-gnu/libgssapi_krb5.so.2 (0x00007fe4d3f57000)
			libresolv.so.2 => /lib/x86_64-linux-gnu/libresolv.so.2 (0x00007fe4d3d3c000)
			libmount.so.1 => /lib/x86_64-linux-gnu/libmount.so.1 (0x00007fe4d3af1000)
			libffi.so.6 => /usr/lib/x86_64-linux-gnu/libffi.so.6 (0x00007fe4d38e9000)
			libgpg-error.so.0 => /lib/x86_64-linux-gnu/libgpg-error.so.0 (0x00007fe4d36d3000)
			libicuuc.so.57 => /usr/lib/x86_64-linux-gnu/libicuuc.so.57 (0x00007fe4d332b000)
			libkrb5.so.3 => /usr/lib/x86_64-linux-gnu/libkrb5.so.3 (0x00007fe4d3056000)
			libk5crypto.so.3 => /usr/lib/x86_64-linux-gnu/libk5crypto.so.3 (0x00007fe4d2e24000)
			libcom_err.so.2 => /lib/x86_64-linux-gnu/libcom_err.so.2 (0x00007fe4d2c20000)
			libkrb5support.so.0 => /usr/lib/x86_64-linux-gnu/libkrb5support.so.0 (0x00007fe4d2a13000)
			libblkid.so.1 => /lib/x86_64-linux-gnu/libblkid.so.1 (0x00007fe4d27ce000)
			libicudata.so.57 => /usr/lib/x86_64-linux-gnu/libicudata.so.57 (0x00007fe4d0d51000)
			libstdc++.so.6 => /usr/lib/x86_64-linux-gnu/libstdc++.so.6 (0x00007fe4d09c9000)
			libgcc_s.so.1 => /lib/x86_64-linux-gnu/libgcc_s.so.1 (0x00007fe4d07b2000)
			libkeyutils.so.1 => /lib/x86_64-linux-gnu/libkeyutils.so.1 (0x00007fe4d05ae000)
		

## Next... Assignment#1

Details of this are [here](../../assignments/assignment1/README.html) now.



