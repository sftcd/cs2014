/*!
 * @file cs2014coin-err.c
 * @brief This is the implementation of utilities for cs2014 coins
 *
 * It should go without saying that these coins are for play:-)
 * 
 * This is part of CS2014
 *    https://down.dsg.cs.tcd.ie/cs2014/examples/c-progs-2/README.html
 */

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

#include <stdio.h>

#include "cs2014coin.h"
#include "cs2014coin-int.h"

/// an array of speciic strings
const char *errstrs[]={
"This should never be seen",
"That's a mad length",
"DRBG failed, which is odd",
"Key generator failed, which is very odd",
"Too many iterations, sorry",
"Unknown ciphersuite",
};

/// macro for how many errors we have
#define CC_MAXERR (sizeof(errstrs)/sizeof(const char*)) 

/*!
 * @brief return out best guess error string
 * @param errno is an errno, presumably returned from somewhere else in this API
 * @return error string (a const)
 *
 * Error string handler. Good to use unique error numbers for all different conditions
 */
const char *cs2014coin_err(int errno)
{
	if (errno==CS2014COIN_GENERR) return(CC_GENERR);
	if (errno>=1 && errno< CC_MAXERR) return(errstrs[errno]);
	return(CC_DEFERR);
}

/*!
 * @brief debug printerfor buffers
 * @param buffer is where stuff's at
 * @prarm buflen is how many octets
 * @return void
 */
void dumpbuf(char *msg, unsigned char *buffer, int buflen)
{
	printf("\n%s, %x long at %p\n",msg,buflen,buffer);
	for (int i=0;i<buflen;i++) {
		//printf("i:%03d,v:%02x",i,buffer[i]);
		printf("%02x",buffer[i]);
		if (!((i+1)%16)) printf("\n");
		else printf(",");
	}
	if (buflen%16) printf("\n");
	printf("\n");
	fflush(stdout);
}

/*!
 * @brief check if rightmost N bits of a buffer are zero
 * @param bits is the value of N (in bits)
 * @param buf is the buffer
 * @param buflen is the length
 * @return 1 if those N bits are all zero, 0 otherwise
 *
 * be better if this were more efficient
 */
int zero_bits(int bits,unsigned char *buf,int buflen)
{
	int allbutlastbytes=bits/8;
	int oddbits=bits%8;
	int i;
	unsigned char lastbyte;
#if 0
	if (((buf[buflen-1])&0xe0)==buf[buflen-1]) {
		printf("\ngood value: %02x\n",buf[buflen-1]);
	}
#endif
	if (allbutlastbytes>buflen) return(0); // can't be more zeros that buffer size :-)
	// loop is safe (does nothing) if bytes==0, i.e. if bits<8
	for (i=buflen-1;i>=buflen-allbutlastbytes;i--) {
		if (buf[i]!=0x00) return(0);
	}
	// that migth be all we need (if asked for a number of bits divisible by 8)
	if (oddbits==0) return(1);
	lastbyte=buf[i];
	// else check last bits via mask
	switch (oddbits) {
		case 1: if ((lastbyte&0xfe)==lastbyte) return(1); break;
		case 2: if ((lastbyte&0xfc)==lastbyte) return(1); break;
		case 3: if ((lastbyte&0xf8)==lastbyte) return(1); break;
		case 4: if ((lastbyte&0xf0)==lastbyte) return(1); break;
		case 5: if ((lastbyte&0xe0)==lastbyte) return(1); break;
		case 6: if ((lastbyte&0xc0)==lastbyte) return(1); break;
		case 7: if ((lastbyte&0x80)==lastbyte) return(1); break;
		case 8: if (lastbyte==0) return(1); break;
		default: return(0);
	}
	return(0);
}
