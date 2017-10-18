/*!
 * @file cs2014coin-check.c
 * @brief This is the implemetation of the cs2014 coin checker
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
#include <string.h>
#include <arpa/inet.h>

#include <mbedtls/error.h>
#include <mbedtls/md.h>
#include <mbedtls/pk.h>

#include "cs2014coin.h"
#include "cs2014coin-int.h"


/*!
 * @brief a local constant time memcmp
 * @param a is buffer 1
 * @param b is buffer 2
 * @param size is the length of both
 * @return 0 for same, 1 for not same 
 *
 * A constant time memcmp, found at: 
 *   https://github.com/OpenVPN/openvpn/commit/11d21349a4e7e38a025849479b36ace7c2eec2ee
 * Note - this was done due to a real attck on OpenVPN
 *   https://www.rapid7.com/db/vulnerabilities/alpine-linux-cve-2013-2061
 */
int lc_memcmp (const void *a, const void *b, size_t size) {
  const uint8_t * a1 = a;
  const uint8_t * b1 = b;
  int ret = 0;
  size_t i;

  for (i = 0; i < size; i++) {
	  ret |= *a1++ ^ *b1++;
  }

  return ret;
}

/// set a bit in a mask to indicate some error
#define SB(___var___,___shift___) (___var___|=(1<<___shift___))

/// clear a bit in a mask to indicate that error wasn't seen
#define CB(___var___,___shift___) (___var___&=~(1<<___shift___))

/*!
 * @brief check a coin
 * @param bits specifies how many bits need to be zero in the hash-output
 * @param buf is an allocated buffer for the coid
 * @param buflen specifies the input coin size
 * @param res contains the result of checking the coin
 * @return zero for success, non-zero for fail (note: success != good coin!)
 *
 * Check a coin of the required quality/strength
 * Note we attempt to be roughly constant time here, just for fun
 * But, if this were called on recovered plaintext, that might be
 * significant! 
 * See https://cryptocoding.net/index.php/Coding_rules
 *
 */
int cs2014coin_check(int bits, unsigned char *buf, int buflen, int *res)
{
	unsigned int ciphersuite=0;
	unsigned presentedbits=0;
	int badcoin=0; // optimism!
	unsigned char localcoin[CC_BUFSIZ];
	unsigned char powbuf[CC_BUFSIZ];
	int powhashlen=242; // magic number!!!
	mbedtls_md_context_t sha_ctx;
	int rv;
	unsigned char hashbuf[CC_BUFSIZ];
	mbedtls_pk_context pk;


#ifdef CC_DEBUG
	printf("Expecting %d bits of PoW\n",bits);
	dumpbuf("2bchecked-coin",buf,buflen);
#endif
	// length check
	memset(localcoin,0,CC_BUFSIZ);
	memset(powbuf,0,CC_BUFSIZ);
	if (buflen < 0x17f || buflen > 0x181) {
		if (buflen > CC_BUFSIZ) {
			memcpy(localcoin,powbuf,CC_BUFSIZ);
		} else {
			memcpy(localcoin,powbuf,buflen);
		}
		SB(badcoin,0);
	} else {
		memcpy(localcoin,buf,buflen);
		CB(badcoin,0);
	}
	// check ciphersuite is what we support
	ciphersuite=(int)(*(int*)localcoin);
	ciphersuite=ntohl(ciphersuite);
	if (ciphersuite!=CS2014COIN_CS_0) {
#ifdef CC_DEBUG
		printf("Bad ciphersuite: %d\n",ciphersuite);
#endif
		SB(badcoin,1);
	} else {
		CB(badcoin,1);
	}
	presentedbits=(int)(*(int*)(localcoin+4));
	presentedbits=ntohl(presentedbits);
	if (presentedbits!=bits) {
#ifdef CC_DEBUG
		printf("presentedbits check fail: %d(seen) != %d(asked)\n",presentedbits,bits);
#endif
		SB(badcoin,7);
	} else {
		CB(badcoin,7);
	}


	/*
		Signature length is a little variable, all other fields are
		fixed length. So if we can grab the signature length then
		we know the rest directly, and we know the sigtnature length
		from the overall length (for this ciphersuite:-)
		We know by calculation that the PoW hash ends at byte 242
	*/

	// check PoW hash
	// does it end with the right number of zero bits?
	if (!zero_bits(bits,buf+powhashlen-32,32)) {
#ifdef CC_DEBUG
		printf("Failed zero_bits check\n");
#endif
		SB(badcoin,2);
	} else {
		CB(badcoin,2);
	}

	// is it a hash of the right thing?
	// the -32 below is to the input to hashing has zeros in the right place
	memcpy(powbuf,localcoin,powhashlen-32); 

	mbedtls_md_init( &sha_ctx );
	rv = mbedtls_md_setup( &sha_ctx, mbedtls_md_info_from_type( MBEDTLS_MD_SHA256 ), 1 );
	if (rv!=0) {
		SB(badcoin,3);
	} else {
		CB(badcoin,3);
	}
	mbedtls_md_starts( &sha_ctx );
	mbedtls_md_update( &sha_ctx, (unsigned char *) powbuf, powhashlen );
	mbedtls_md_finish( &sha_ctx, hashbuf );

	// is the value right?
	if (lc_memcmp(hashbuf,localcoin+powhashlen-32,32)) {
#ifdef CC_DEBUG
		printf("Failed PoW hash recalc.\n");
		dumpbuf("PoW hash provided",localcoin+powhashlen-32,32);
		dumpbuf("PoW hash calculated",hashbuf,32);
#endif
		SB(badcoin,4);
	} else {
		CB(badcoin,4);
	}

	// check self-signed signature
	mbedtls_pk_init( &pk );
	rv = mbedtls_pk_parse_public_key( &pk, localcoin+12,0x9e );
	if (rv!=0) {
#ifdef CC_DEBUG
		printf("Failed to parse public key.\n");
#endif
		/// TODO: have a dummy public key ready for this so we do sig check of some sort
		SB(badcoin,5);
	} else {
		CB(badcoin,5);
	}

	// calculate hash
	mbedtls_md_starts( &sha_ctx );
	mbedtls_md_update( &sha_ctx, (unsigned char *) localcoin, powhashlen );
	mbedtls_md_finish( &sha_ctx, hashbuf );

	unsigned char *sigp=localcoin+powhashlen+4;
	int siglen=buflen-powhashlen-4;

	rv = mbedtls_pk_verify( &pk, MBEDTLS_MD_SHA256, hashbuf, 0, sigp,siglen);
	if (rv!=0) {
#ifdef CC_DEBUG
		printf("Failed to verify signature\n");
		dumpbuf("re-calc'd hash",hashbuf,32);
		dumpbuf("presented sig",sigp,siglen);
#endif
		SB(badcoin,6);
	} else {
		CB(badcoin,6);
	}

	// did we see some error somewhere?
	if (badcoin==0) {
#ifdef CC_DEBUG
		printf("Setting res to good.\n");
#endif
		*res=CS2014COIN_GOOD;
	} else { 
#ifdef CC_DEBUG
		printf("Setting res to bad.\n");
#endif
		*res=CS2014COIN_BAD;
	}

	return(0);
}



