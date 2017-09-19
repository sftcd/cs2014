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

typedef struct _finfo {
    char *name;
    char *link;
    char isdir;
} finfo, *finfo_p;

typedef union _ufinfo {
    char *name;
    char *link;
} ufinfo, *ufinfo_p;



int main()
{

	finfo fvar;
	ufinfo uvar;
	long adiff;

	fvar.name="foo";
	fvar.link=NULL;
	fvar.isdir=0;
	printf("fvar size: %lu\n",sizeof(fvar));
	printf("fvar addr: %p\n",&fvar);
	
	uvar.name="foo";
	printf("uvar size: %lu\n",sizeof(uvar));
	printf("uvar addr: %p\n",&uvar);

	
	adiff=(long)((void*)&fvar-(void*)&uvar);
	printf("addr diff: %lu\n",adiff);

}
