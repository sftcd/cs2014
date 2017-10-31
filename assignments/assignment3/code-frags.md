# Some good, bad and indifferent code fragments

I took a look at the assignment3 submissions as of October 30.
I've tried to anonymise these - apologies if I've gotten that
wrong.

Remember: our overall goal here is NOT that you all learn how to
write C code, but that you lern how to code *well!* 

#Unsafe cast
 
		coin[7] = (char) bits;
		...or...
		coin[7] = (unsigned char) bits;

- the value of bits wasn't checked before this cast
- the cast from int to char or unsigned char truncates
- the char variant is worse - try with bits == -1 to see

#Yay! Recursion!

If you handle the nonce by incrementing then you have a
nice opportunity to use recursion. One of you did...
		
		void increment_byte(unsigned char *c, int len, int index) 
		{	
			 c[index]++;	
			 if(c[index]!=0xff)
				return;
			 else if(index!=0)
				 increment_byte(c,len,index-1);
			 else
				 increment_byte(c,len,len-1);
		}

And a bit below that...

		increment_byte(c,len,len-1);

My own flavour of that is:

		
		/*!
		 * @brief increment nonce by one, wrap around if needed
		 * @param ptr is a pointer to just beyond the end of the nonce
		 * @param guard_ptr is a pointer to the LHS of the buffer, beyond which we mustn't go
		 * @return void, we make it work:-)
		 *
		 * This'll incrememnt the nonce starting from the end of the
		 * buffer and walking backwards as incremented bytes wrap
		 * around. We never fail here and do want go faster stripes.
		 * If you provide bad input, bad things may happen!
		 * We do depend here on the limit on iterations in the calling
		 * code.
		 * We'll recurse - stack hit in 1/256 calls not too bad
		 * for this.
		 * Guard pointer will be hit with probability ~2^248
		 * But if it were (e.g. by a bad caller) then we'd be
		 * sad and scribble on memory so let's not do that.
		 * Note that if guard pointer is hit, then we'll return
		 * an unmodified buffer (well, 2nd time), so this code
		 * depends on the higher layer CS2014COIN_MAXITER limit
		 * being enforced.
		 */
		void incr_nonce(unsigned char *ptr, unsigned char* guard_ptr)
		{
			if ((ptr-1)==guard_ptr) return;
			unsigned char ch=*(ptr-1);
			if (ch==255) {
				incr_nonce(ptr-1,guard_ptr);
				*(ptr-1)=0;
			} else {
				*(ptr-1)=(ch+1);
			}
			return;
		}
		
#Memory is not in such short supply...

I've seen a bunch of these...
		
		unsigned char buffer[242];

Bad idea: 242 is exactly what we want today as input to the PoW
hash and signature, *but*:

- likely to change over time
- the full coin will be bigger and there's no reason to use >1 buffer
  (and it is inefficient to do so)

#Lengths should use htonl...

That was in the hints, why not do it right?
(Fair enough, maybe this isn't very obvious;-)

		int siglen; // assign as output from signing function
		unsigned char *bp; // position pointer at right place in buffer
		uint32_t long htonlout; // scratch var to hold network byte order version of value

		htonlout=htonl(siglen); 
		memcpy(bp,&htonlout,4); 

I liked this bit of someone's code:
	
		unsigned char *start = toHashBuf;
		int temp = htonl(coin.ciphersuite);
		memcpy(start, &temp, 4);
		start = start + 4;
		temp = htonl(coin.bits);
		memcpy(start, &temp, 4);
		start = start + 4;
		temp = htonl(coin.keylen);
		memcpy(start, &temp, 4);
		start = start + 4;
		memcpy(start, coin.keyval, coin.keylen);
		start = start + coin.keylen;
		temp = htonl(coin.noncelen);
		memcpy(start, &temp, 4);
		start = start + 4;
		memcpy(start, coin.nonceval, coin.noncelen);
		start = start + coin.noncelen;
		temp = htonl(coin.hashlen);
		memcpy(start, &temp, 4);
		start = start - coin.noncelen;

That kind of pattern is good as it's easy to add another
field to the structure and it's clear what's going on.
(Good job whoever wrote that.)

#Not checking return values...

If you don't check return values when using an external API (like
mbed TLS), then your code won't be accepted in the real world.

		mbedtls_ecp_gen_key(MBEDTLS_ECP_DP_SECP521R1, mbedtls_pk_ec(key), mbedtls_ctr_drbg_random, &ctr_drbg );
		...should be...
		rv=mbedtls_ecp_gen_key(MBEDTLS_ECP_DP_SECP521R1, mbedtls_pk_ec(key), mbedtls_ctr_drbg_random, &ctr_drbg );
		if (rv!=0) {
			// handle error
			return(rv); // or similar
		}

#Don't declare a function within a function

You know, I didn't even know this'd work - had to check it out!
It's a bad idea!

		// Generate the Nonce
			unsigned char nonce[32];
			memset(nonce, 0, 32);
			unsigned char rndbyte(){
			unsigned long int s;
			syscall(SYS_getrandom, &s, sizeof(unsigned long int), 0);
			unsigned char byte=(s>>16)%256;
			return(byte);
			}
			for(int i = 0; i < 32; i++){
				nonce[i] = rndbyte();
				
			}
			for(int i=0; i <32; i++){
			buffer[173+i] = nonce[i];
			}

To make it clearer what's going on there:

		#include <stdio.h>
		
		int f1(int a)
		{
			printf("hi there\n"); 
			int f2(int b) {
				printf("old pal (%d)\n",b);
				return(0);
			}
			f2(a);
			return(0);
		}
		
		int main(int argc,char*argv[])
		{
		 	f1(2);
		}

#Learn to handle success well...

```cs2014coin_make()``` has buflen declared as an ```int *```
so that the final length of the coin can be returned to the
calling code, separate from the function's return value,
which indicates success or failure. On input that variable
has the size of the buffer provided.

Say if you've calculated the final coin length in a 
variable called ```hilen``` (with the coind bytes in a 
buffer called ``hival```) then before you
return to the calling code you'll need soemthing like:

		if (*buflen<hilen) {
			// crap, faller at the last!!
			return(CC_BUF2SMALL);
		}
		memcpy(buf,hival,hilen);
		*buflen=hilen;
		return(0);

Confession time: I forgot that check myself until I was
writing this text!

#Do the doxygen thing...

I'm not sure if any of you did that for functins you
wrote? (Apologies if I missed some.)



