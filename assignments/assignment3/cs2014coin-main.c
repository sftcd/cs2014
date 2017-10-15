/*!
 * @file cs2014coin-main.c
 * @brief This is the main function for cs2014 coin handling
 * 
 * This is part of CS2014
 *    https://down.dsg.cs.tcd.ie/cs2014/examples/c-progs-2/README.html
 */
/* 


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

// usual includes
#include <stdio.h>
#include <stdlib.h>
#include <string.h> // for strdup()

// for getopt()
#include <getopt.h>

/// the API we want... 
#include "cs2014coin.h"

/// the max length of zero-bit run we can support 
#define MAXZEROBITS 20

/// the default length of zero-bit run 
#define DEFZEROBITS 17

/// mode where we make a coin
#define MODE_MAKE 0

/// mode where we check a coin looks feasible
#define MODE_CHECK 1

/// default file name
#define DEFFNAME "cs2014.coin"

void usage(char *progname)
{
	fprintf(stderr,"Make/Verify a coin-like thing.\n");
	fprintf(stderr,"Options:\n");
	fprintf(stderr,"\t%s [-m] [-b <number>} [-f <file>] where \n",progname);
	fprintf(stderr,"\t\t-m indicates to make a coin (default is to try check one)\n");
	fprintf(stderr,"\t\t\tThere's be a progress-bar printed - more bits == much more time!\n");
	fprintf(stderr,"\t\tnumber is the number of zero-bits required in the coin (max: %d, default: %d )\n",MAXZEROBITS,DEFZEROBITS); 
	fprintf(stderr,"\t\tfile will have the coin written to it, or read from it (default: %s)\n",DEFFNAME);
	exit(-1);
}

int main(int argc,char *argv[])
{
	int mode=MODE_CHECK;
	int bits=DEFZEROBITS;
	int rv=0;
	int res=0;
	unsigned char coinbuf[CS2014COIN_BUFSIZE]; /// buffer for a coin
	char *fname=strdup(DEFFNAME); /// string for file name

	// getopt vars
	int opt;
	
	// check inputs with getopt
	while((opt = getopt(argc, argv, "?hmb:f:")) != -1) {
		switch(opt) {
			case 'h':
			case '?':
				usage(argv[0]);
				break;
			case 'b':
				{
					int nbits;
					nbits=atoi(optarg);
					if (nbits<=0 || nbits>MAXZEROBITS) {
						fprintf(stderr,"Can't look for %d bits (min:0,max:%d)\n",nbits,MAXZEROBITS);
						usage(argv[0]);
					} else {
						bits=nbits;
					}
				}
				break;
			case 'm':
				mode=MODE_MAKE;
				break;
			case 'f':
				free(fname); fname=strdup(optarg);
				break;
			default:
				fprintf(stderr, "Error - No such option: `%c'\n\n", optopt);
				usage(argv[0]);
		}
	}

	// and then do as asked
	switch (mode) {
		case MODE_MAKE:
			{
				FILE *fp;
				int byteswritten;
				int actualsize=CS2014COIN_BUFSIZE;
				rv=cs2014coin_make(bits,coinbuf,&actualsize);
				if (rv) {
					fprintf(stderr,"Error (%d) making coin (%s) - exiting\n",rv,cs2014coin_err(rv));
					free(fname); // being tidy!
					return(1);
				}
				if ((fp=fopen(fname,"wb"))==NULL) {
					fprintf(stderr,"Error making coin: can't write (%s) - exiting\n",fname);
					free(fname); // being tidy!
					return(1);
				}
				byteswritten=fwrite(coinbuf,1,actualsize,fp);
				if (byteswritten!=actualsize) {
					fprintf(stderr,"Error making coin: error writing to %s (%d) - exiting\n",fname,byteswritten);
					free(fname); // being tidy!
					return(1);
				}
				fclose(fp);
				break;
			}
		case MODE_CHECK:
			{
				FILE *fp=fopen(fname,"rb");
				int bytesread=0;
				if (fp==NULL) {
					fprintf(stderr,"Error checking coin: can't open %s - exiting\n",fname);
					free(fname); // being tidy!
					return(1);
				}
				bytesread=fread(coinbuf,1,CS2014COIN_BUFSIZE,fp);
				if (bytesread<=0) {
					fprintf(stderr,"Error checking coin: error reading from %s (%d) - exiting\n",fname,bytesread);
					free(fname); // being tidy!
					return(1);
				}
				fclose(fp);
				rv=cs2014coin_check(bits,coinbuf,bytesread,&res);
				if (rv) {
					fprintf(stderr,"Error (%d) checking coin (%s) - exiting\n",rv,cs2014coin_err(rv));
					free(fname); // being tidy!
					return(1);
				}
				if (res==CS2014COIN_GOOD) {
					printf("Nice coin!\n");
				} else {
					printf("Bummer - that's a dud (res=%d)!\n",res);
				}
				break;
			}
		default:
			fprintf(stderr,"Error no idea what mode I'm in (%d)\n",mode);
			free(fname); // being tidy!
			return(1);
	} 

	free(fname);
	return(0);
}
