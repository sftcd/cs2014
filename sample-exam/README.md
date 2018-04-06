
# CS2014 2017/2018 sample exam paper and associated code

This is an example exam paper for my course on systems 
programming (<a href="https://down.dsg.cs.tcd.ie/cs2014">CS2014</a>),
the canonical URL for this is 
<a href="https://down.dsg.cs.tcd.ie/cs2014/sample-exam/README.html">here</a>.

##Files in this example:

- README.md - this file in markdown format
- README.html - this file, in HTML format (```'make html'``` to update that from .md)
- [Makefile](Makefile) - to build the sample answer code and HTML (there's a clean target too)
- [cs2014-exam-2018-sample.pdf](./cs2014-exam-2018-sample.pdf) - the sample paper
- [dnsparse.c](./dnsparse.c) - code for question 1
- [mainfsize.c](./mainfsize.c) - code for question 2
- [mainfsize_pp.cpp](./mainfsize_pp.cpp) - code for question 2
- [fsize.c](./fsize.c) - code for question 2
- [fsize.h](./fsize.h) - code for question 2
- [badcat.c](./badcat.c) - code for question 3
- [middlingbad.c](./middlingbad.c) - code for question 3 with minimal improvement
- [lessbadcat.c](./lessbadcat.c) - code for question 3 with more improvement
- [bad-middling.html](./bad-middling.html) - diff from badcat.c to middlingcat.c
- [bad-lessbad.html](./bad-lessbad.html) - diff from badcat.c to lessbadcat.c
- [middling-lessbad.html](./middling-lessbad.html) - diff from middlingcat.c to lessbadat.c

After running ```'make'``` then these files will be produced (if all
goes well):

- README.html - the html version of README.md
- dnsparse - a question 1 binary
- mainfsize - a question 2 binary
- mainfsize_pp - a question 2 binary
- mainfsize.o - a question 2 object file
- mainfsize_pp.o - a question 2 object file
- fsize.o - a question 2 object file
- badcat - a bad, crashy binary for question 3 
- middlingcat - a less bad non-crashy program for question 3
- lessbadcat - an even less bad non-crashy program for question 3

# Question 1 notes

- I wrote the code there in "real time" so I'm pretty sure it's buggy, in particular 
  there's likely an off-by-one error if a label of length 63 is encoutered.
  (You can criticise that code as an exercise if you like - send a pull
  request!)
- If you suspect issues like the above, it's ok to add notes around your answer.
- As you can see the mapping from the quesion to the code is fairly, but not
  entirely, obvious. I *strongly* recommend you use a workbook to write out
  initial code and then try tidy that up later. Do include all such rough
  work of course - it'll get marks if it contains anything of use.

# Question 2 notes

- For part (b) - you should describe the typical edit, compile, test
  cycle - for such descriptions, I only need (but do need) enough
  detail to show you understand what you're doing - you do not need
  to include exhaustive detail nor be overly precise.
- I haven't coded up 'enhancements' - pull requests are welcome!

# Question 3 notes

- There're lots more than 5 flaws in that code! (Oddly, I did find it
  on the net, and used almost exactly what I found - be careful using
  random code!)
- Check out the diff files for the kinds of flaws to talk about for
  part (a) - I assume that's fairly obvious.
- For part (b), I chose to try keep the new code comparable to the
  old code, just to make those diffs useful. You don't need to do 
  that in your answer.
- For part (c), I'd like you to show me that you know how to test
  a program like this - I don't need the fully theory of fuzzing,
  but would like you to provide your general appraoch and a few
  examples of things you'd test (less obvious ones are better).

