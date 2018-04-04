#include <stdio.h>
#include "fsize.h"

void usage(char *prog)
{
	fprintf(stderr,"usage: %s [list-of-files]\n",prog);
	exit(1);
}

int main(int argc,char *argv[])
{
	size_t fs;
	int rv;
	// read args
	if (argc<2) usage(argv[0]);
	for (int f=1;f!=argc;f++) {
		rv=getfsize(argv[f],&fs);
		if (rv) {
			printf("Can't stat %s\n",argv[f]);
		} else {
			printf("Size of %s is %zu\n",argv[f],fs);
		}
	}
	return(0);
}
