#include <stdio.h>
#include <stdlib.h> // For exit()
#include <string.h> 

int main(int argc,char*argv[])
{
	FILE *fptr;
	char filename[100], c;

	if (argc==2) strcpy(filename,argv[1]);
	else {
		printf("Enter the filename to open \n");
		scanf("%s", filename);
	}

	// Open file
	fptr = fopen(filename, "r");
	if (fptr = NULL) {
		printf("Cannot open file \n");
		exit(0);
	}

	// Read contents from file
	c = fgetc(fptr);
	while (c != EOF) {
		printf ("%c", c);
		c = fgetc(fptr);
	}
}
