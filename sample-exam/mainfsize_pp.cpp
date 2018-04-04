#include <iostream>
#include <stdlib.h>
using namespace std;
#include "fsize.h"

void usage(char *prog)
{
	cerr << "usage: " <<  prog << " [list-of-files]\n";
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
			cout << "Can't stat " << argv[f] << "\n";
		} else {
			cout << "Size of " << argv[f] << "is " << fs << "\n";
		}
	}
	return(0);
}
