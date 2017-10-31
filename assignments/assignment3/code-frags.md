# Some good, bad and indifferent code fragments

I took a look at 42 assignment3 submissions as they were on October 30.
I've tried to anonymise snippets below where I can - apologies if I've gotten that
wrong.

It's clear that some of you are helping one another, which is
great. But please don't write someone else's code or allow
someone else to write your code - it'd be easy to end up 
failing the exam if you did that.

Remember: our overall goal here is NOT that you all learn how to
write any old C code that passes the submitty marking, but that 
you learn how to code *well* in C.

If you have submitted already and are at a 20/20 score:

- you do not NEED to do anything
- but consider making your code better in one or more of
  the ways described here
- and you could also try make your code 3x faster! (So far,
  I've not seen anyone figure that out.)
- please do help out others who're finding this
  trickier - you never know when you might need them
  to help you with something else (and thanks for the help 
  already given)

If you're not yet @ 20/20 then consider these as more hints
and good advice.

##Use of literal lengths...

We could all be tidier and ```#define``` all the 
lengths we're using. I fully admit that is tedious
and didn't do it myself, but we really should.

The reason we should is in case that information
changes over time, e.g. if we move from a SHA-256
PoW hash to a SHA-512 PoW hash, then things will
be different and we could make our code a bit more
future-proof by having e.g. 

		#define POWHASHALG "sha256"
		#define POWHASHLEN 32

For this assignment, you can reasonably argue though
that mostly, that's not needed. In a real-world bit
of coding, it would definitely be needed.
(That's one reason for the ```ciphersuite``` construct,
as it munges down a bunch of extensibility issues
into one thing which can be easier to handle, if
one can avoid a combinatoric explosion of suites.)

##Unsafe cast
 
		coin[7] = (char) bits;
		...or...
		coin[7] = (unsigned char) bits;

- the value of bits wasn't checked before this cast
- the cast from int to char or unsigned char truncates
- the char variant is worse - try with bits == -1 to see

##Random or incrementing nonce...

Either works, but incrementing should be a good bit quicker
and you were asked to think about performance.

##Yay! Recursion!

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

One person stumbled onto a more efficient way than
mine. (But I claim I was playing with the code then:-)
The following should work:

		// initialise nonceptr and nonceint to something
		nonceint++;
		memcpy(nonceptr, &nonceint, 4);

So long as you have the MAXITER guard that should be ok.
Not sure of the actual performance difference vs. 
calling a function, but be interesting to check, with
compiler optimisation on.

##There's no need for useless code....

Getting rid of unused code is a good thing:

  		mbedtls_aes_context aes_ctx;
		mbedtls_aes_init( &aes_ctx );

In that case, the above two lines were the only ones
that referred to ```aes_ctx``` ever - which is not
a shock as we're not encrypting anything today:-)

##Indent your code properly!!!

It really is a sin to not do that, and will make you take longer
to do things and cause others to hate your code.

Note: "properly" can vary, but it has to be *consistent*.

This is a particularly egregiously bad example:

		if((rv = mbedtls_pk_setup(&key,mbedtls_pk_info_from_type(MBEDTLS_PK_ECKEY)))== 0){
		
		if((rv = mbedtls_ctr_drbg_seed(&ctr_drbg,mbedtls_entropy_func,&entropy,pers,strlen(pers))) == 0){
		
		if((rv = mbedtls_ecp_gen_key(ec_curve,mbedtls_pk_ec(key),mbedtls_ctr_drbg_random, &ctr_drbg))== 0){
		
		if((rv = write_public(&key, "dump")) == 0){
		}
		}
		}
		}

##Code re-use is good! But not always needed...

Some of you re-used your ```rndbyte()``` implementation from
earlier. That is a fine thing to do, but not needed if you
prefer to not do that. In my code I re-used ```mbedtls_entropy_func()```

There is a very subtle reason to use "different" streams
of randomness here - one for secrets (which includes
the ECC private key) and another for public values like 
nonces. If your RNG is borked, it may be the case that
an attacker, seeing the public values, could deduce
something about the private key that you have just
generated before generating the nonce.

So my code is less optimal here really.

But, to be sure, one would have to delve deep into the
calls to see if in fact the two RNG streams are really
independent or not. (I didn't do that yet.)

##Memory is not in such short supply...

I've seen a bunch of these...
		
		unsigned char buffer[242];

Bad idea: 242 is exactly what we want today as input to the PoW
hash and signature, *but*:

- likely to change over time
- the full coin will be bigger and there's no reason to use >1 buffer
  (and it is inefficient to do so)

##Lengths should use htonl...

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

##Not checking return values...

If you don't check return values when using an external API (like
mbed TLS), then your code won't be accepted in the real world.

		mbedtls_ecp_gen_key(MBEDTLS_ECP_DP_SECP521R1, mbedtls_pk_ec(key), mbedtls_ctr_drbg_random, &ctr_drbg );
		...should be...
		rv=mbedtls_ecp_gen_key(MBEDTLS_ECP_DP_SECP521R1, mbedtls_pk_ec(key), mbedtls_ctr_drbg_random, &ctr_drbg );
		if (rv!=0) {
			// handle error
			return(rv); // or similar
		}

##Don't declare a function within a function

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

##Some comments are good...

I liked this one:

		//_________________________________________________________________________________________________________________
		//INITIALISATION OF GENERAL VARIABLES AND ARRAYS
		//_________________________________________________________________________________________________________________

There were comments like that that before each separate major
chunk of code.

##Don't use madly long lines ever

These are just bad - it's really hard to understand them

		if (hash[count] == 16 || hash[count] == 32 || hash[count] == 48 || hash[count] == 64 || hash[count] == 80 || hash[count] == 96 || hash[count] == 112 || hash[count] == 128 || hash[count] == 144 || hash[count] == 160 || hash[count] == 176 || hash[count] == 192 || hash[count] == 224 || hash[count] == 240 || hash[count] == 0)
		
		printf("Coin Details:\n\ncipherSuite = %d\nbits = %d\npublic key length= %d\npublic key=: %s\nnonselength:%d \n\n---------------------\n\n", mycoin.ciphersuite,mycoin.bits,mycoin.keylen, mycoin.keyval,mycoin.noncelen);

		for(int i = sizeof(Ciphersuite) + sizeof(bits) + sizeof(keyLength) + sizeof(keyVal) + sizeof(nonceLength); i - sizeof(Ciphersuite) - sizeof(bit) - sizeof(keyLength) - sizeof(keyVal) - sizeof(nonceLength) < sizeof(nonce); i++) {
			// do stuff
		}

Note that the fix in such cases is NOT to simply split the long
line over multiple lines in the file. In these cases (at least
the first and last) some other code would be better, and would
require declaration and use of some other variables.

##You are NOT dealing with files here, really

Opening, esp writing, files inside an API such as this would
be a bad idea and surprising to people, so don't do that.
Use buffers instead.

We should NEVER see something like this:

    write_public_key( &tempKey, "publicKey.txt" );

The code in that submission could well work, but is
not good code.

Problems with such intermediate files:

- Maybe machine has no filesystem (portability)
- You don't know the ```$CWD``` where you'll be so you may not have write access (bug)
- Maybe filesystem is full (failure)
- Files (in that case) weren't unlinked/deleted after use (untidy, maybe unsafe)
- Speed (filesystem could be remote/NFS!)
- Race condition (security)

To explain that race condition more...

		if ( (ret = write_public_key( &tempKey, "publicKey.txt" ) ) != 0 ) {
			mbedtls_printf( "write_public_key failed\n");
		}
		// problem is HERE
		// some other code could have replace content of file right now
		FILE *pubKeyFile = fopen("publicKey.txt",  "rb");
		if (pubKeyFile == NULL) {
			mbedtls_printf("File %s failed to open.", "publicKey.txt");
		}

Yep - overall - don't do that!
 

##Don't do stuff in a tight loop, if you can do it outside...

So in our case, better to increment nonce in-place, inside
the buffer that's fed into the hash function.
So, instead of:

		// set offset to whereever nonce goes in buf
		while(iterations<CS2014COIN_MAXITER) {
			// do hash
			mbedtls_md_starts( &sha_ctx );		 
			mbedtls_md_update( &sha_ctx, (unsigned char *) powbuf, 242);	
			mbedtls_md_finish( &sha_ctx, hash );	 		 
			// are we done?
				// if so, break out of loop
			// if not, incremement hash 
			increment_byte(coin.nonce,32,31);
			memcpy(powbuf+offset,coin.nonce,32);
		}

Instead do this...

		// set offset to whereever nonce goes in buf
		while(iterations<CS2014COIN_MAXITER) {
			// do hash
			mbedtls_md_starts( &sha_ctx );		 
			mbedtls_md_update( &sha_ctx, (unsigned char *) powbuf, 242);	
			mbedtls_md_finish( &sha_ctx, hash );	 		 
			// are we done?
				// if so, break out of loop
			// if not, incremement hash 
			increment_byte(powbuf+offset,32,31);
		}
		// if we need our coin struct to be up to date then...
		memcpy(coin.nonce,powbuf+offset,32);

##Debug lines are good..., but... there's a "but" :-)

It's a really good idea to include this kind of thing to help 
you figure out stuff as you go...

		#ifdef CC_DEBUG
			dumpbuf("Input:",hash,256);
		#endif	

But don't leave calls to dumpbuf in your final code - that
could break someone who calls your function.

Do use the ```CC_DEBUG``` directive defined in ```cs2014coin-int.h```
instead of inventing a new one. (Unless you've a good reason to
define a new one.)

You could, but I would not, use the ```mbedtls_printf```
function instead of just ```printf```

		mbedtls_printf( " ok (key size: %d bits)\n", (int) ctx_sign.grp.pbits );

Only reason to use that would be if we wanted our code
to be as portable as the mbed TLS library. That'd be a
good thing, but was not asked for as part of this 
assignment. 

##Get rid of old (esp non-working) debug lines

If you write a debug line, esp one that doesn't
work, then don't leave that line of code there - it 
might cause a crash sometime:


		mbedtls_pk_write_pubkey_der( &key, key_output_buf, keylen);
		printf("%s",key_output_buf);

In the above case, as the ```mbedtls_pk_write_pubkey_der``` is
so mad, so long as the buffer you gave it is bigger than the
DER encoded key, then ```key_output_buf[0]``` is likely to
have value 0x00, and so the ```printf``` call will have no
noticeable effect. But it's extremely brittle and likely to
fail if left there. 

Note though that that particular example may be a work-in-progress,
and might be gone by now:-)

##Empty lines let you move easier in vi...

The ```{``` and ```}``` characters in vi allow you to jump over
"paragraphs" so it's useful to have actually empty lines in your
code and not lines with only tabs or spaces.

##Learn to handle success well...

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

Note that while ```buflen[0]=hilen;``` works, 
it's a bad idea and ```*buflen=hilen;``` is better.
A reader of the code later might mistakenly assume ```buflen[1]```
is ok to use, but it isn't.

Here's another wrong way:

		memcpy(buflen, (char*)&hilen, 2);

And of course the buffer is suppiled to the API and can't
be changed so this is wrong:

		*buf = *hival;

instead you have to:

		memcpy(buf,hival,hilen);

##Clean up after yourself...

One of you was good and did this:

		mbedtls_ecdsa_free( &ctx_verify );
		mbedtls_ecdsa_free( &ctx_sign );
		mbedtls_ctr_drbg_free( &ctr_drbg );
		mbedtls_entropy_free( &entropy );
		mbedtls_sha256_free( &sha256_ctx );

That's a fine thing to do. I'd forgotten to do it,
but have now. 

		mbedtls_md_free(&sha_ctx);
		mbedtls_pk_free(&key);

In my coin-making code, ```valgrind``` went from leaking
544 butes to zero as a result of me adding those ```mbedtls_*_free``` calls.
In our command line program, that's no big deal as we only make one
coin, but for the API, this is a real issue - ```cs2014coin_make()``` could
be called over and over and without these lines would eventually 
crash the process and maybe even the machine (depending on OS).

		stephen@host:~/code/cs2014/assignments/assignment3$ valgrind  ./cs2014-coin -m
		==30844== Memcheck, a memory error detector
		==30844== Copyright (C) 2002-2015, and GNU GPL'd, by Julian Seward et al.
		==30844== Using Valgrind-3.11.0 and LibVEX; rerun with -h for copyright info
		==30844== Command: ./cs2014-coin -m
		==30844== 
		..............................................................................
		Mining took 79368 iterations
		==30844== 
		==30844== HEAP SUMMARY:
		==30844==     in use at exit: 0 bytes in 0 blocks
		==30844==   total heap usage: 20,998 allocs, 20,998 frees, 1,853,416 bytes allocated
		==30844== 
		==30844== All heap blocks were freed -- no leaks are possible
		==30844== 
		==30844== For counts of detected and suppressed errors, rerun with: -v
		==30844== ERROR SUMMARY: 0 errors from 0 contexts (suppressed: 0 from 0)

##Do the doxygen thing...

I don't believe any of you did that (added javadoc lines) for 
the functions you wrote? (Apologies if I missed any.)

Doing so is a good thing. One reason is that it makes you
think, at least one more time, about the parameters and
return values for your functions, which will often 
lead you to change your mind as to what's best to do.



