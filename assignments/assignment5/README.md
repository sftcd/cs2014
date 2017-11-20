<meta charset="utf-8" />

# CS2014 2017 Assignment5 - We all like Fridays

The ```tree``` program lists files in directories
recursively with one line per file/directory. We
looked at that as one of our [examples](../../examples/tree/README.html).

Your assignment is to modify the tree program so that when provided with
a new ```-Z``` command line argument, it prepends the string
"HAPPY FRIDAY!!! " whenever a file or directory was last modified on a Friday
in the local timezone, and to do that by adding another function pointer for
the happy-friday variant of ```listdir``` in a new source file called 
```cs2014.c```.

You will also need to modify the ```Makefile``` and the ```tree.h``` and
```tree.c``` source files to get this to work.

You should submit the three source files: ```cs2014.c```, ```tree.h``` 
and ```tree.c```. You should NOT submit your ```Makefile```.

Other than the above additions, all existing functionality MUST
be maintained.

The coding required for this assignment is fairly easy but this will
be the first time you modify a Makefile, create a new source file, 
and use function pointers, so that adds up to a reasonable bit of
work.

## To setup a working environment...

Assuming your working directory will be ```~/code/cs2014/assignments/assignment5```
then copy the ```tree-1.7.0``` directory to there and then make your changes
inside the ```tree-1.7.0``` directory.

## Sample output

The following shows the output when the new ```-Z``` argument
is not provided:

		.
		├── ietf95-sf-sched.pdf
		├── saag
		│   ├── agenda.txt
		│   ├── fgont-predictable-numeric-ids.odp
		│   ├── fgont-predictable-numeric-ids.pdf
		│   ├── fgont-saag-predictable-numeric-ids.pdf
		│   ├── IETF_saag_eap-noob_2016-04-07.pdf
		│   ├── IETF_saag_eap_noob_2016-04-07.pptx
		│   ├── IoT-saag.pdf
		│   ├── minutes.txt
		│   ├── SAAG-IETF95.pdf
		│   ├── SAAG-IETF95.pptx
		│   ├── saag-rsalz.pdf
		│   ├── saag-rsalz.pptx
		│   └── saag-vcelak-nsec5.pdf
		├── secdir
		│   └── agenda.txt
		└── wrap-up-notes.txt
		
		2 directories, 16 files

And if we run ```tree -Z``` in the same directory we
see:

		.
		├── ietf95-sf-sched.pdf
		├── saag
		│   ├── agenda.txt
		│   ├── fgont-predictable-numeric-ids.odp
		│   ├── fgont-predictable-numeric-ids.pdf
		│   ├── fgont-saag-predictable-numeric-ids.pdf
		│   ├── IETF_saag_eap-noob_2016-04-07.pdf
		│   ├── IETF_saag_eap_noob_2016-04-07.pptx
		│   ├── IoT-saag.pdf
		│   ├── minutes.txt
		│   ├── SAAG-IETF95.pdf
		│   ├── SAAG-IETF95.pptx
		│   ├── saag-rsalz.pdf
		│   ├── saag-rsalz.pptx
		│   └── saag-vcelak-nsec5.pdf
		├── secdir
		│   └── agenda.txt
		└── HAPPY FRIDAY!!! wrap-up-notes.txt
		
		2 directories, 16 files

And ```ls -lrt wrap-up-notes.txt``` gives us:

		-rw-rw-r-- 1 stephen stephen    68 Apr  8  2016 wrap-up-notes.txt

And April 8th 2016 was indeed a Friday.

### Some hints...

Before you start you'll need to be able to compile and run your
local copy of ```tree```. Once that's done then I suggest...

- Learning how the ```listdir``` function pointers work.
- Figuring out how the command line arguments are handled.
- Copying from one of the other function pointer
  implementations into your new ```cs2014.c``` file that has the
  implementation you want to use when ```-Z``` is provided on the
  command line. 
- You'll modify the Makefile to include that new source and then
  will have to do some renaming and make other tweaks to 
  ```tree.h``` and ```tree.c``` to get ```-Z``` to trigger
  your new code.
- Once you can provide the ```-Z``` command line argument to 
  call your new ```listdir``` implementation then you
  can figure out how to check the modification time of files
  and directories, and how to get the "HAPPY FRIDAY!!! "
  string into the right place in the output.
- The space at the end of "HAPPY FRIDAY!!! " is significant
  and needs to be included.
- Lastly, it is the *modification time* of the file/directory
  in which you are interested, not any of the other timestamps
  associated with files.

Note that you can make the changes in any way you like so
long as you meet the specification above, but following the
hints above ought be near the easiest path to success.

## What's here?

The files in this assignment directory you should see now are:

- [Makefile](Makefile)  - the Makefile to builld the above and link in the mbed TLS library
- [README.html](README.html) - this HTML file
- [README.md](README.md) - the markdown source for this HTML file

## Deadline

The deadline for submission of this assignment is 2017-11-27

## Submission

For this assignment you should submit three source files:

- tree.h
- tree.c
- cs2014.c 

To submit your assignment use 
[https://cs2014.scss.tcd.ie/](https://cs2014.scss.tcd.ie/) as usual.

