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

/// Show different options for API

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/syscall.h>
#include <linux/random.h>

/// TODO: check if conditional compile needed as per: 
/// TODO: https://stackoverflow.com/questions/30800331/getrandom-syscall-in-c-not-found

#define OPTION3

#ifdef OPTION1
int rndbytes(unsigned char* buf,int buflen)
{
	if (!buf) return(1);
	syscall(SYS_getrandom, buf, buflen, 0);
	return(0);
}
#endif

#ifdef OPTION2
        int rndbytes(unsigned char** bufp,int buflen)
        {
            if (!bufp) return(1);
            unsigned char *buf=malloc(buflen);
            if (!buf) return(1);
            syscall(SYS_getrandom, buf, buflen, 0);
            *bufp=buf;
            return(0);
        }

#endif

#ifdef OPTION3
        unsigned char *rndbytes(int buflen)
        {
            unsigned char *buf=malloc(buflen);
            if (!buf) return(NULL);
            syscall(SYS_getrandom, buf, buflen, 0);
            return(buf);
        }
#endif

#define LIMIT 65536

void usage(char *progname)
{
	fprintf(stderr,"Print some random numbers from /dev/random.\n");
	fprintf(stderr,"Options:\n");
	fprintf(stderr,"\t%s <number> where number is the number of bytes to print [Default: 10, min: 0, max: %d]\n",progname,LIMIT);
	exit(-1);
}

int main(int argc,char *argv[])
{
	int number=10;

	if (argc==2) {
		int newnumber=atoi(argv[1]);
		if (newnumber<=0) {
			fprintf(stderr,"%d too small\n",newnumber);
			usage(argv[0]);
		}
		if (newnumber>LIMIT) {
			fprintf(stderr,"%d too big\n",newnumber);
			usage(argv[0]);
		}
		number=newnumber;
	}

#ifdef OPTION1
	unsigned char *buf=malloc(number);
	if (!buf) {
		fprintf(stderr,"alloc fail\n");
		return(1);
	}
	int rv=rndbytes(buf,number);
	if (rv) {
		fprintf(stderr,"rndbytes fail: %d\n",rv);
		return(rv);
	}
#endif

#ifdef OPTION2
	unsigned char *buf;
	int rv=rndbytes(&buf,number);
	if (rv) {
		fprintf(stderr,"rndbytes fail: %d\n",rv);
		return(rv);
	}
#endif

#ifdef OPTION3
	unsigned char *buf=rndbytes(number);
	if (!buf) {
		fprintf(stderr,"rndbytes fail\n");
		return(1);
	}
#endif

	for (int i=0;i!=number;i++) {
		printf("rnd%d: %02x\n",i,buf[i]);
	}

	free(buf);

	return(0);
}
