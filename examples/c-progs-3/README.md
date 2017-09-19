
#C Program Examples#3

These are some C program examples from my course on systems 
programming (<a href="https://down.dsg.cs.tcd.ie/cs2014">CS2014</a>),
the canonical URL for this is 
<a href="https://down.dsg.cs.tcd.ie/cs2014/examples/c-progs-3/README.html">here</a>.

##Files in this example:

- README.md - this file in markdown format
- README.html - this file, in HTML format (```'make html'``` to update that from .md)
- [Makefile](Makefile) - to build the example and HTML (there's a clean target too)
- [refman.pdf](refman.pdf) - doxygen automated documentation from javadoc comments
- [str-dox](str-dox) - doxygen config file
- [sizes.c](sizes.c) - play program to see sizes and similar

After running ```'make'``` then these files will be produced (if all
goes well):

- README.html - the html version of README.md
- sizes - the binary for sizes.c


## A program to play with structures a bit...

[```sizes.c```](sizes.c) in this example defines
and assigns some stuff then prints something
about that. It's not (meant to be) functional,
just a plaything so you can see what works and
some of how it works.

Some code snippets from that...

		/// a file-info like structure 
		typedef struct _finfo {
		    char *name;
		    char *link;
		    char isdir;
		} finfo, *finfo_p;
		
		/// a union that could be a name or
		/// a link (not useful really:-)
		typedef union _ufinfo {
		    char *name;
		    char *link;
		} ufinfo, *ufinfo_p;
		
		int main()
		{
		
			/// play about with the declarations here and see if you
			/// understand what the compiler is doing
		
			finfo fvar; /// on-stack struct
			char stringy[256]; /// on-stack memory
			char *allocedthing; /// heap memory
			ufinfo uvar; /// on-stack union
			long adiff; /// on-stack (long) integer
		
			snprintf(stringy,256,"foo");
		
			if ((allocedthing=malloc(1024))==NULL) {
				printf("Bummer malloc failed\n");
				return(1);
			}
		
			fvar.name=stringy;
			fvar.link=NULL;
			fvar.isdir=0;
			printf("fvar.name size: %lu\n",sizeof(fvar.name));
			printf("fvar.link size: %lu\n",sizeof(fvar.link));
			printf("fvar.isdir size: %lu\n",sizeof(fvar.isdir));
			printf("fvar size: %lu\n",sizeof(fvar));
			printf("fvar addr: %p\n",&fvar);
			
			uvar.name="foo";
			printf("uvar.name size: %lu\n",sizeof(uvar.name));
			printf("uvar.link size: %lu\n",sizeof(uvar.link));
			printf("uvar size: %lu\n",sizeof(uvar));
			printf("uvar addr: %p\n",&uvar);
		
			adiff=(long)((void*)&fvar-(void*)&uvar);
			printf("adiff size: %lu\n",sizeof(adiff));
			printf("diff val: %lu\n",adiff);
		
			printf("stringy size %lu\n",sizeof(stringy));
			printf("allocedthing size %lu\n",sizeof(allocedthing));
			printf("allocedthing addr %p\n",&allocedthing);
			printf("heap size %lu\n",malloc_usable_size(allocedthing));
			printf("heap addr %p\n",allocedthing);
		
			free(allocedthing);
		
			if ((allocedthing=malloc(444444))==NULL) {
				printf("Bummer malloc failed\n");
				return(1);
			}
			printf("heap size %lu\n",malloc_usable_size(allocedthing));
			printf("heap addr %p\n",allocedthing);
		
			return(0);
		
		}

Noteworthy things:

- struct vs. union
- typedef
- pointer type and struct type
- sizes
- stack vs. heap
- ```malloc_usable_size()``` result != input to ```malloc()```
- pointers can move in alloc/free cycles
- you can get almost all the info printed from ```gdb sizes``` 
- the addresses you think you're using may not be the real thing
