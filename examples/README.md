# CS2014 Examples

This is the directory of examples for [CS2014](https://down.dsg.cs.tcd.ie/cs2014).
Each subdirectory has a README.md, a bit of related code and a Makefile.

- README.md - this file, in markdown (the source)
- README.html - this file in html (```make html``` to update)
- Makefile - will run make in each subdirectory, has a "make clean" target
- [bm](bm/README.html) - the "broken malloc" example
- [shell](shell/README.html) - the "shell" example
- [c programs#1](c-progs-1/README.html) - the first few C program examples

Note-to-self: various markdown/html files here contain the output of the
```'man'``` command. That should use ascii output (e.g. ```man -E ascii 3
rand```) and I also need to remember to replace left angle brackets in the
output with the corresponding HTML entity or they won't display, so the 
incantation to use when editing markdown is: ```man -E ascii 3 rand | sed -e 's/</\&lt/g'```


