#include <stdio.h>
#include "broken-malloc.h"

#define MINTESTS 0
#define MAXTESTS 100

int main(int argc, char **argv)
{
	int i;
	int countfails=0;
	int tests=10;

	if (argc==2) {
		int maybetests=atoi(argv[1]);
		if (maybetests <= MINTESTS || maybetests > MAXTESTS) {
			fprintf(stderr,"Out of range argument (\"%s\") min: %d, max: %d - exiting\n",
				argv[1],MINTESTS,MAXTESTS);
			return(1);
		}
		tests=maybetests;
	}

	for (i=1;i<=tests;i++) {
		// char *x=malloc(i);
		char *x=calloc(100,i);
		if (!x) {
			printf("Malloc %d failed!\n",i);
			countfails++;
		} else {
			printf("Malloc %d succeeded!\n",i);
			free(x);
		}
	}

	printf("Tests: %d, fails: %d\n",tests,countfails);
	return(0);
}
