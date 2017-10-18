/*!
 * @file cs2014coin-int.h
 * @brief Definitions/macros used internally
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

#ifndef CS2014COIN_INT_H_INCLUDED
#define CS2014COIN_INT_H_INCLUDED

/// turns on some debug printing
#undef CC_DEBUG 			

/// turns on loadsa debugging
#undef CC_DEBUG_EXTRA 		

/// we'll use this on stack to save coding mallocs etc
#define CC_BUFSIZ 16000 

#define CC_DEFERR "Bummer, no idea what went wrong there" ///< a generic error
#define CC_GENERR "Some kind of fairly generic error happened" ///< another generic error

// constants for each error string index in the errstrs array (except the first!)
#define CC_TOOLONG 			1 /// input is too long 
#define CC_DRBGCRAP 		2 /// can't initiate DRBG
#define CC_KEYGENFAIL 		3 /// key generator failed
#define CC_ITERS 			4 /// an error to use if we've iterated too much searching for a coin
#define CC_BADCIPHERSUITE 	5 /// an unknown ciphersuite

/// an array of speciic strings - CC_foo #define'd values are index the strings in this array 
extern const char *errstrs[];

/*!
 * @brief debug printer for buffers
 * @param buffer is where stuff's at
 * @prarm buflen is how many octets
 * @return void
 */
void dumpbuf(char *msg, unsigned char *buffer, int buflen);

/*!
 * @brief check if rightmost N bits of a buffer are zero
 * @param bits is the value of N (in bits)
 * @param buf is the buffer
 * @param buflen is the length
 * @return 1 if those N bits are all zero, 0 otherwise
 *
 * be better if this were more efficient
 */
int zero_bits(int bits,unsigned char *buf,int buflen);

#endif /* CS2014COIN_INT_H_INCLUDED */


