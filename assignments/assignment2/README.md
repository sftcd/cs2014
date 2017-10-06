# CS2014 2017 Assignment2 - A bit of crypto

Your assignment is to download and build the [mbed TLS](https://tls.mbed.org/kb)
package and to make a tiny modification to it's sample AES file encryption program 
as described below. 

For class: scan through Arm's mbed TLS [coding
standards](https://tls.mbed.org/kb/development/mbedtls-coding-standards).
It'd be a fine thing (but is not mandatory for marking) if students 
followed those standards too when working with this code.

IMPORTANT: Keep your work, including the build of mbed TLS, you'll need it again 
for other assignments! (You could repeat the work, but that'd be boring:-)

## Setup a working environment

Let's say your working directory is going to be ```$HOME/code```
then you need to do the following (or equivalent) in a shell:

		$ mkdir $HOME/code
		$ cd $HOME/code
		$ git clone https://github.com/sftcd/cs2014.git
		...various output
		$ cd assignments/assignment2
		$ wget https://tls.mbed.org/download/mbedtls-2.6.0-apache.tgz
		...various output
		$ tar xzvf mbedtls-2.6.0-apache.tgz
		...various output
		$ cd mbedtls-2.6.0
		$ make
		... lots of output, takes a minute or two
		$ cd ..
		$ make
		...various output

I'll explain those one by one:

First you make a working directory:

		$ mkdir $HOME/code

Then go there...

		$ cd $HOME/code

Then get a copy of the git repo for the course (you should have done that
already btw!)

		$ git clone https://github.com/sftcd/cs2014.git

Now go to the directory for this assignment:

		$ cd assignments/assignment2

... and download a copy of the mbed TLS tarball:

		$ wget https://tls.mbed.org/download/mbedtls-2.6.0-apache.tgz

... explode the tarball

		$ tar xzvf mbedtls-2.6.0-apache.tgz

... cd into the mbed TLS directory

		$ cd mbedtls-2.6.0

... build the mbed TLS code

		$ make

... go back up one level to the assignment2 directory

		$ cd ..

... and run the build for the assignment st

		$ make

## What's there?

The files in this assignment directory you should see now are:

- assignment2 - the excutable form of the base tool you'll modify in a bit
- [assignment2.c](assignment2.c) - the base file encrypting tool you'll modify in a bit
	- (Note: This is just a straight copy of what'll be in ./mbedtls-2.6.0/programs/aes/aescrypt2.c)
- assignment2.o - the object file for encrypting tool you'll modify in a bit
- [Makefile](Makefile)  - the Makefile to builld the above and link in the mbed TLS library
- [mbedtls-2.6.0](mbedtls-2.6.0/) - the directory with the mbed TLS stuff
- [mbedtls-2.6.0-apache.tgz](https://tls.mbed.org/download/mbedtls-2.6.0-apache.tgz)- the tarball you downloaded
- [README.html](README.html) - this HTML file
- [README.md](README.md) - the markdown source for this HTML file

## Run the tool as-is:

		$ ./assignment2
		
		  asssignment2 <mode> <input filename> <output filename> <key>
		
		   <mode>: 0 = encrypt, 1 = decrypt
		
		  example: aescrypt2 0 file file.aes hex:E76B2413958B00E193
		$


## A simple modification...

This week, all you need to do is replace the clumsy "0" (for encryption) with
any case-insensitive substring prefix of the word "encryption" and then
simlarly replace the "1" for decryption, with any case-insensitive substring
prefix of the word "decryption" and otherwise leave everything else as-is.

So, when you're done the following should work:

		$ echo "hi" >plain.txt
		$ ./asssignment2 eNcr plain.txt cipher.bin thisisnotagoodkey
		$ ./asssignment2 De cipher.bin recoveredplain.txt thisisnotagoodkey
		$  diff -s plain.txt recoveredplain.txt 
		Files plaintext and plaintext are identical
		$

And of course any variants of the start of the words "encryption"
and "decryption" provided in the right place should work just as well,
regardless of upper or lowercase.

### A hint...

The function ```strcasestr()``` might be your friend here, check
out it's ```man``` page - but if using that you'll need to add
this to nearly the top of your source file:

		#define _GNU_SOURCE         /* See feature_test_macros(7) */

Otherwise, if you don't want to use ```strcasestr()```, that's fine,
you can write your own function to do the equivalent comparison.

## Deadline

The deadline for submission of this assignment is 2017-10-16

## Submission

For this assignment you should only submit your single file of
source code, which can be called ```assignment2.c```

To submit your assignment use 
[https://cs2014.scss.tcd.ie/](https://cs2014.scss.tcd.ie/) as usual.

