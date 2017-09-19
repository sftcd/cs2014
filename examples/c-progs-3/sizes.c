/* 
 * Copyright (c) 2017 stephen.farrell@cs.tcd.ie
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

/// mess about with struct and union and see how big things are

#include <stdio.h>
#include <stdlib.h>
#include <malloc.h>

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
