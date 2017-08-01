#include <stdlib.h>
#include <string.h>
#include <time.h>

// comment this out for non-repetitive behaviour
//#define REPEAT 


// what percentage of mallocs should fail?
#define PERCENTFAIL 30

#ifdef REPEAT
	// repeating version, no PRNG initialisation, same each time
	#define malloc(__xxx__) (rand()%100<=PERCENTFAIL?0:malloc((__xxx__)))
#else
	// PRNG initialisation => different behaviour each time 
	char* __srand_inited__=NULL;
	char __srand_state__[100];
	#define malloc(__xxx__) (( \
		( \
			(__srand_inited__==NULL) \
			? \
				__srand_inited__=initstate(time(NULL),__srand_state__,100) \
			:\
				NULL \
		), \
		random() \
		)%100<=PERCENTFAIL?0:malloc((__xxx__)))

#endif

void *__vxx__;
int __tsz__;
#define calloc(__sz__,__n__) (	\
			(__tsz__=(__sz__)*(__n__))? \
				( (__vxx__=malloc(__tsz__)) ?  \
					memset(__vxx__,__tsz__,0) \
				: 0 ) \
			: 0)

// realloc is left as an exercise for the reader!

