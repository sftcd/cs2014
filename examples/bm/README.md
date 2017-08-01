
#Random Memory Allocaion Failure for Fun and Profit

This is an example from my course on systems 
programming (<a href="https://down.dsg.cs.tcd.ie/cs2014">CS2014</a>),
the canonical URL for this is 
<a href="https://down.dsg.cs.tcd.ie/cs2014/examples/bm/README.html">here</a>.

##Files in this example:

- README.md - this file
- Makefile - to build the example and HTML (there's a clean target too)
- broken-malloc.h - the header file we'd include when using this
- broken-malloc.c - a C program to test our macros
- README.html - this file, in HTML format (```'make html'``` will creete that from the markdown)

After running ```'make'``` then these files will be produced (if all
goes well):

- broken-malloc - the executable that runs the tests

##Background

This example has my favourite line of code ever! I first wrote (a
version of) this in the mid-1990's. It purpose is to break things, 
for good.

The context was that I was working in a large-ish software development
team on a large codebase (maybe 10^6 LOC) where that code has lots of
calls to malloc, and we suspected (knew actually:-) that not all bits 
of calling code checked the return value from malloc.

The LOC itself:

		#define malloc(__xxx__) (rand()%100<=PERCENTFAIL?0:malloc((__xxx__)))

What does that do?

------------------------------------------

First, what is malloc()? Let's use the unix/linux manual pages to find out... 

		man 3 malloc

That produces this information...

<pre>
MALLOC(3)                                           Linux Programmer's Manual                                           MALLOC(3)

NAME
       malloc, free, calloc, realloc - allocate and free dynamic memory

SYNOPSIS
       #include &ltstdlib.h>

       void *malloc(size_t size);
       void free(void *ptr);
       void *calloc(size_t nmemb, size_t size);
       void *realloc(void *ptr, size_t size);

DESCRIPTION
       The  malloc() function allocates size bytes and returns a pointer to the allocated memory.  The memory is not initialized.
       If size is 0, then malloc() returns either NULL, or a unique pointer value  that  can  later  be  successfully  passed  to
       free().

       The  free()  function  frees  the memory space pointed to by ptr, which must have been returned by a previous call to mal-
       loc(), calloc(), or realloc().  Otherwise, or if free(ptr) has already been called before, undefined behavior occurs.   If
       ptr is NULL, no operation is performed.

       The  calloc()  function  allocates  memory  for an array of nmemb elements of size bytes each and returns a pointer to the
       allocated memory.  The memory is set to zero.  If nmemb or size is 0, then calloc()  returns  either  NULL,  or  a  unique
       pointer value that can later be successfully passed to free().

       The  realloc()  function  changes  the  size  of  the  memory block pointed to by ptr to size bytes.  The contents will be
       unchanged in the range from the start of the region up to the minimum of the old and new sizes.  If the new size is larger
       than the old size, the added memory will not be initialized.  If ptr is NULL, then the call is equivalent to malloc(size),
       for all values of size; if size is equal to zero, and ptr is not NULL, then the call is equivalent to  free(ptr).   Unless
       ptr is NULL, it must have been returned by an earlier call to malloc(), calloc() or realloc().  If the area pointed to was
       moved, a free(ptr) is done.

RETURN VALUE
       The malloc() and calloc() functions return a pointer to the allocated memory, which is suitably aligned for  any  built-in
       type.   On  error, these functions return NULL.  NULL may also be returned by a successful call to malloc() with a size of
       zero, or by a successful call to calloc() with nmemb or size equal to zero.

       The free() function returns no value.

       The realloc() function returns a pointer to the newly allocated memory, which is suitably aligned for  any  built-in  type
       and may be different from ptr, or NULL if the request fails.  If size was equal to 0, either NULL or a pointer suitable to
       be passed to free() is returned.  If realloc() fails, the original block is left untouched; it is not freed or moved.

ERRORS
       calloc(), malloc(), and realloc() can fail with the following error:

       ENOMEM Out of memory.  Possibly, the application hit the RLIMIT_AS or RLIMIT_DATA limit described in getrlimit(2).

ATTRIBUTES
       For an explanation of the terms used in this section, see attributes(7).

       +---------------------+---------------+---------+
       |Interface            | Attribute     | Value   |
       +---------------------+---------------+---------+
       |malloc(), free(),    | Thread safety | MT-Safe |
       |calloc(), realloc()  |               |         |
       +---------------------+---------------+---------+
CONFORMING TO
       POSIX.1-2001, POSIX.1-2008, C89, C99.

NOTES
       By default, Linux follows an optimistic memory allocation strategy.  This means that when malloc() returns non-NULL  there
       is  no  guarantee that the memory really is available.  In case it turns out that the system is out of memory, one or more
       processes will be killed by the OOM killer.  For more information, see the description  of  /proc/sys/vm/overcommit_memory
       and /proc/sys/vm/oom_adj in proc(5), and the Linux kernel source file Documentation/vm/overcommit-accounting.

       Normally,  malloc()  allocates  memory  from  the heap, and adjusts the size of the heap as required, using sbrk(2).  When
       allocating blocks of memory larger than MMAP_THRESHOLD bytes, the glibc malloc() implementation allocates the memory as  a
       private  anonymous mapping using mmap(2).  MMAP_THRESHOLD is 128 kB by default, but is adjustable using mallopt(3).  Allo-
       cations performed using mmap(2) are unaffected by the RLIMIT_DATA resource limit (see getrlimit(2)).

       To avoid corruption in multithreaded applications, mutexes are used  internally  to  protect  the  memory-management  data
       structures  employed by these functions.  In a multithreaded application in which threads simultaneously allocate and free
       memory, there could be contention for these mutexes.  To scalably handle memory allocation in multithreaded  applications,
       glibc creates additional memory allocation arenas if mutex contention is detected.  Each arena is a large region of memory
       that is internally allocated by the system (using brk(2) or mmap(2)), and managed with its own mutexes.

       SUSv2 requires malloc(), calloc(), and realloc() to set errno to ENOMEM upon failure.  Glibc assumes  that  this  is  done
       (and  the  glibc  versions of these routines do this); if you use a private malloc implementation that does not set errno,
       then certain library routines may fail without having a reason in errno.

       Crashes in malloc(), calloc(), realloc(), or free() are almost always related to heap corruption, such as  overflowing  an
       allocated chunk or freeing the same pointer twice.

       The malloc() implementation is tunable via environment variables; see mallopt(3) for details.

SEE ALSO
       brk(2), mmap(2), alloca(3), malloc_get_state(3), malloc_info(3), malloc_trim(3), malloc_usable_size(3), mallopt(3),
       mcheck(3), mtrace(3), posix_memalign(3)

COLOPHON
       This page is part of release 4.09 of the Linux man-pages project.  A description of the project, information about
       reporting bugs, and the latest version of this page, can be found at https://www.kernel.org/doc/man-pages/.

GNU                                                         2015-08-08                                                  MALLOC(3)
</pre>

------------------------------------------

Ok, I can kinda guess what rand() might be, but how to confirm?

Same plan.

		man 3 rand

<pre>
RAND(3)                                             Linux Programmer's Manual                                             RAND(3)

NAME
       rand, rand_r, srand - pseudo-random number generator

SYNOPSIS
       #include &ltstdlib.h>

       int rand(void);

       int rand_r(unsigned int *seedp);

       void srand(unsigned int seed);

   Feature Test Macro Requirements for glibc (see feature_test_macros(7)):

       rand_r(): _POSIX_C_SOURCE

DESCRIPTION
       The  rand()  function  returns  a pseudo-random integer in the range 0 to RAND_MAX inclusive (i.e., the mathematical range
       [0, RAND_MAX]).

       The srand() function sets its argument as the seed for a new sequence of pseudo-random integers to be returned by  rand().
       These sequences are repeatable by calling srand() with the same seed value.

       If no seed value is provided, the rand() function is automatically seeded with a value of 1.

       The  function  rand()  is not reentrant, since it uses hidden state that is modified on each call.  This might just be the
       seed value to be used by the next call, or it might be something more elaborate.  In order to get reproducible behavior in
       a threaded application, this state must be made explicit; this can be done using the reentrant function rand_r().

       Like  rand(),  rand_r() returns a pseudo-random integer in the range [0, RAND_MAX].  The seedp argument is a pointer to an
       unsigned int that is used to store state between calls.  If rand_r() is called with the same initial value for the integer
       pointed to by seedp, and that value is not modified between calls, then the same pseudo-random sequence will result.

       The  value  pointed to by the seedp argument of rand_r() provides only a very small amount of state, so this function will
       be a weak pseudo-random generator.  Try drand48_r(3) instead.

RETURN VALUE
       The rand() and rand_r() functions return a value between 0 and RAND_MAX (inclusive).   The  srand()  function  returns  no
       value.

ATTRIBUTES
       For an explanation of the terms used in this section, see attributes(7).

       +--------------------------+---------------+---------+
       |Interface                 | Attribute     | Value   |
       +--------------------------+---------------+---------+
       |rand(), rand_r(), srand() | Thread safety | MT-Safe |
       +--------------------------+---------------+---------+
CONFORMING TO
       The  functions  rand()  and  srand()  conform  to  SVr4,  4.3BSD,  C89,  C99, POSIX.1-2001.  The function rand_r() is from
       POSIX.1-2001.  POSIX.1-2008 marks rand_r() as obsolete.

NOTES
       The versions of rand() and srand() in the Linux C Library use the same random number  generator  as  random(3)  and  sran-
       dom(3),  so  the lower-order bits should be as random as the higher-order bits.  However, on older rand() implementations,
       and on current implementations on different systems, the lower-order bits are much less random than the higher-order bits.
       Do not use this function in applications intended to be portable when good randomness is needed.  (Use random(3) instead.)

EXAMPLE
       POSIX.1-2001  gives  the  following example of an implementation of rand() and srand(), possibly useful when one needs the
       same sequence on two different machines.

           static unsigned long next = 1;

           /* RAND_MAX assumed to be 32767 */
           int myrand(void) {
               next = next * 1103515245 + 12345;
               return((unsigned)(next/65536) % 32768);
           }

           void mysrand(unsigned int seed) {
               next = seed;
           }

       The following program can be used to display the pseudo-random sequence produced by rand() when given a particular seed.

           #include &ltstdlib.h>
           #include &ltstdio.h>

           int
           main(int argc, char *argv[])
           {
               int j, r, nloops;
               unsigned int seed;

               if (argc != 3) {
                   fprintf(stderr, "Usage: %s &ltseed> &ltnloops>\n", argv[0]);
                   exit(EXIT_FAILURE);
               }

               seed = atoi(argv[1]);
               nloops = atoi(argv[2]);

               srand(seed);
               for (j = 0; j &lt nloops; j++) {
                   r =  rand();
                   printf("%d\n", r);
               }

               exit(EXIT_SUCCESS);
           }

SEE ALSO
       drand48(3), random(3)

COLOPHON
       This page is part of release 4.09 of the Linux man-pages project.  A description of the project, information about report-
       ing bugs, and the latest version of this page, can be found at https://www.kernel.org/doc/man-pages/.

                                                            2016-03-15                                                    RAND(3)
</pre>
