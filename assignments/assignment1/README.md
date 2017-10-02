
# CS2014 2017 Assignment1

Your assignment is to modify the [rndbytes.c](../../examples/c-progs-1/rndbytes.c)
program to produce lists of random-length (between 0 and 255) lists of random
bytes in the format shown below.

Your program should take the number of lists to produce as it's first command
line argument, and the output file to produce as it's second command line 
argument. 

So if you call your program ```assignment1``` and run that to produce 
2 lists, it should produce output like that below:

		$ ./assignment1 2 output.txt
		$ cat output.txt
		0,0d
		c3,12,1c,40,61,2c,7a,af,
		9b,be,2c,04,3a
		
		1,4e
		2f,5a,61,53,21,77,a2,16,
		cf,bf,cf,a8,1d,8b,14,d8,
		d2,ff,bc,aa,29,9b,32,8c,
		be,1a,01,71,75,38,b7,43,
		af,c9,84,40,c0,d5,bf,dd,
		cb,0d,9c,bc,2c,27,a4,2d,
		4d,c0,ca,7a,3d,c9,7a,d3,
		8a,88,d3,37,99,f7,07,af,
		4b,35,1e,9d,4d,83,bd,31,
		67,23,69,e4,77,13

In more detail, the format is:

- First line: list-number (between 0 and 65535, sequentially increasing), 
  then a comma, then the random number 
  (<256, in lowercase hex, with a leading 0 when needed) of random numbers in this list,
  then a newline 
- Next lines for this list: the list of random numbers (each <256 in
  lowercase hex with preceeding 0 when needed), with 8 numbers per line, with commas
  separating them, except for the last random number which is not followed by a
  comma, but by a newline
- Then one blank line.
- Then the next list as per the above.

Other than list-numbers (which are decimal)
all numbers to be printed as two lowercase 
hex digits, with a leading zero when needed.

The bash script [```assignment1-verifier.sh```](assignment1-verifier.sh) can
be used to test your program. Note that
```assignment1-verifier.sh``` may accept some
not quite correct input, for example an
empty file works, but code that only 
produces that won't pass the assignment!
So do look at your output yourself too.

The python script [```assignment1-verifier.py```](assignment1-verifier.py)
can also be used to test your output.

Once submitted, your program will be tested with 
list-numbers randomly selected between 0 and 65535, 
so you should test for larger list-numbers.
(More lists will also ensure that you test more
corner-cases.)

An output from running ```./assignment1 4```
is shown below:

		$ ./assignment1 4 output.txt
		$ cat output.txt
		0,29
		05,ea,52,4e,a4,67,af,e9,
		4b,bd,f1,2e,85,5c,d9,58,
		ee,15,52,2a,83,53,bb,61,
		72,63,39,9e,16,0f,ef,41,
		dd,d0,58,f9,dd,fd,22,61,
		7e
		
		1,1b
		dd,86,18,11,16,af,03,ad,
		4e,05,37,8d,34,f3,81,10,
		7d,5b,69,3f,5a,64,5d,a8,
		e9,6d,23
		
		2,8d
		d6,c4,88,43,3c,a3,4a,33,
		0b,06,17,e5,f4,04,dc,87,
		ca,99,94,de,99,1c,26,ad,
		e6,e9,45,0c,12,b8,6b,11,
		d6,7d,19,e8,b3,d2,5d,e7,
		23,de,97,8e,9a,f7,ec,16,
		20,45,8f,ab,38,17,2c,1a,
		bb,8c,a2,8e,2a,8f,03,f5,
		bd,1a,e1,1c,84,17,17,85,
		bd,6b,01,e3,63,58,30,16,
		9c,48,d8,86,58,11,33,4a,
		52,74,bb,45,d0,ce,c7,64,
		fc,b0,91,3f,17,f4,3e,2f,
		6b,22,7f,da,af,75,f3,7c,
		92,d6,eb,1d,3d,4f,5a,2b,
		0c,f7,c9,08,0b,f1,8f,0c,
		3d,9d,6a,78,06,e0,2b,b1,
		69,b7,78,15,73
		
		3,1b
		37,a2,13,6c,93,28,32,26,
		52,b4,75,06,f6,ed,47,00,
		c8,93,5f,95,e2,7d,63,1a,
		10,43,e2

If you run your program and feed the output
to ```assignment1-verifier.sh``` (or
```assignment-verifier.py```) you should see
something like this:

		$ ./assignment1 789 output.txt
		$ ./assignment1-verifier.sh output.txt
		Passed! read 789 entries

## Deadline

The deadline for submission of this assignment is 2017-10-09

## Submission

For this assignment you only need to submit your single file of
source code, which can be called ```assignment1.c```

To submit your assignment use 
[https://cs2014.scss.tcd.ie/](https://cs2014.scss.tcd.ie/) as usual.

