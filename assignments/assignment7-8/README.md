<meta charset="utf-8" />

# CS2014 2017 Assignment7 - Vanity Primes 

## Specification

Your job this time is to write a *daemon* that implements an HTTP server
that generates "vanity primes" on request when supplied with the "vanity"
string to include in such a prime. (Note: in real applications we would
NOT do this - it'd weaken the security properties of whatever was using
the primes - this is for play only!)

- A *daemon* is a program that forks a child process to do it's work and then
  the parent exits leaving the child process running as a server. (This part of the code is
given to you, you just need to use it right.) 

- A "vanity prime" is a (long) prime number the high order bits of which are
  constructed to match a supplied vanity string. (Think of vanity car license
plates.)

- All our vanity primes for this assignment MUST be 1024 bits long

- For this assignment, vanity strings are limited to ASCII hex values, e.g.
  "0xdeadbeef" but may be of any length up to (nearly) 1024 bits long. 

- Requests and responses MUST use the HTTP protocol properly 
using an HTTP GET request to the ```/.well-known/vanityprime``` 
resource on the HTTP server, with the vanity string specified as an ASCII-hex
value (upper or lower case) provided via a "vs=" query string. (See 
[RFC5875](https://tools.ietf.org/html/rfc5785) for reasons why the resource
is named like that.)

- An example request/response send using the ```curl``` tool would be:

		$ curl http://127.0.0.1:8081/.well-known/vanityprime?vs=0xabcdef0d
		abcdef0d3a3a6a85e58529393eaa0e0a6ec78dbbffccc53135d53cdbd49e5bd0927a6ca209de46f97fd8de910d0ad2dab2863562b423c58b45d72ab0bc9d33c432acebeb23ed4f5d6dcec0ad47de2e26a4a4ca13ab0a80279a29610fc25f5e37c07545bca440f734dc4efa9241a992d4a539dc56de2dda6d4dd129d1575491bb

- Normal HTTP processing is expected to work - a standard web browser or a 
command line tool (such as  ```wget``` or ```curl```) ought all work when
talking to your server. That means that you do need a "proper" HTTP 
server that'll know how to handle (in this case ignore) various HTTP
headers that browsers add, e.g. DNT, Accept-* etc. 

- Your server need only work for localhost and hence need not support TLS,
nor use of a domain name for the HTTP server. 
It's fine if your server only works for IPv4, and not [::1] or even only 
for 127.0.0.1. Similarly, there's no need to support h2 nor QUIC - just
plain old HTTP/1.1 is fine.
If you do support any of those things, that's fine, but not needed. 

- You MAY allow specifying the port number on the command line when starting the
server. The default port to use is 8081.

- We MUST be able to tell the server (forked by the daemon) to exit when we're done playing
about. That's done by accessing the "/.well-known/vpexit" resource, e.g.:

		$ curl http://127.0.0.1:8081/.well-known/vpexit
		$

- You MUST ensure that your code exits cleanly *before* submitting
to submitty. If you don't figure that out, Christian or I may be irritated:-)
See below for guidance as to the stages in developing this assignment.

## Vanity Prime number generation

There's a good-enough [WikiPedia](https://en.wikipedia.org/wiki/Generating_primes)
page on how to generate long primes - it's pretty easy, just generate a random
odd value of the length required, then check if it's prime first using checks
for divisibility by small primes and then a probabilistic test like Miller-Rabin
that gives high confidence of primality - typically we end up with a probability
of (waaay) less than one in 2^20 of a composite passing the test.

For the purposes of this assignment, the cryptographic quality of the primes
doesn't matter - we don't care if we end up with so-called strong primes or not.

Supplying an overly long vanity string can lead to failure to find a vanity prime.
There are lots of prime numbers in the universe, but sometimes you'll be
unluckly. Being unlucky should be overwhelmingly unlikely as long as the
vanity string is less than maybe ~1000 bits long. (More info
[here](https://crypto.stackexchange.com/questions/1970/how-are-primes-generated-for-rsa),
where one of the comments says about 1 in 400 1024-bit odd numbers
will be prime, thanks to 
the [prime number theorem](https://mathworld.wolfram.com/PrimeNumberTheorem.html).)

In a more general case, we might want the vanity string to be visible in various standard
encodings of the prime number, such as base64 or binary etc. but that's not needed here.

The vanity string is incorporated into the first step of prime generation - we
just overwrite the most significant bits of the random prime-candidate with our
vanity string. That does require delving under the hood of the normal prime
generator code a bit - but that's the fun bit of the exercise.  

## Implementation approaches: C++ *or* Go

You have (at least) two options for implementing this assignment: 

- modify the C++ example program from 
[civetweb](https://github.com/civetweb/civetweb.git), 
adding in calls to [mbedtls](https://tls.mbed.org/) code for 
vanity prime generation, or,
- (more adventurously:-) implement using the ```Go``` language 

Depending on which option you take, you'll submit to a
different Submitty assignment (as7/Vanity-C++ or as8/Go-go-Vanity). 

Not everyone will be able to install the ```Go``` language support
(and it's missing on college boxes today, sorry), hence the option
of doing the assignment in C++. 

If someone submits both a C++ and golang solution, whichever
scores higher will be used for marking.

If you would like to take a different implementation approach,
check with [me](mailto:stephen.farrell@cs.tcd.ie) first, but it'll
be hard to support most other approaches, though I might allow it,
if someone has something interesting to suggest.

## Implementation stages

I recommend you follow this plan for implementing, regardless
of the language used:

1. Read/understand the problem
1. Get a vanilla HTTP server running (not as a daemon)
1. Add a handler of some kind for the "/.well-known/vpexit" resource and
get that working with curl, i.e. your server should exit when that
resource is requested
1. Add a handler for the "/.well-known/vanityprime" resource that
just echoes something
1. Add support for extracting the vanity string from the query string 
to that handler
1. Figure out how to generate a vanity prime
1. Add the vanity prime generation code to your server 
1. Integrate the vanity prime generation code with your handler
1. Test various error cases
1. Turn the server into a daemon using the language-specific 
method for that recommended below
1. Test some more, esp that exiting works correctly in all
cases

*After* all that has worked, only then submit to submitty.

## C++ implementation

[civetweb](https://github.com/civetweb/civetweb.git) is a relatively
lightweight HTTP library/server code base that's good enough for
what we want. You should clone that somewhere and build it.

civetweb has an example C++ server intended for embedded sysems 
that allows you to easily
add a handler for the .well-known URLs we're using.
Once you've cloned the civetweb
git repo you'll find that code and a Makefile in  the 
```./examples/embedded_cpp/``` directory.
You need to change the ```main()``` function in that to be
the ```process()``` function called from ```daemon.cpp```

For prime generation code, you can copy (relevant parts of) the body 
of the implementation of  the ```mbedtls_mpi_gen_prime()``` function 
into your code. You'll need to modify the Makefile to tell it
where to find mbedtls header files and to link the mbedtls 
libraries. See assignment3's Makefile for one example of a way
to do that. (I'll not say to copy that approach, but as3's
Makefile does show you what you need.)

In the [c++](c++/) direcory below here, you'll also find a 
Makefile that works to integrate the embedded_cpp server
with mbedtls. That directory also has the ```daemon.cpp```
described below and (with obvious modifications) the Makefile 
will build your daemon version.

Specific notes for use with Submitty:

- Your server MUST honor the "/.well-kniwn/vpexit" resource and 
exit when requested. The default code in ```embedded_cpp.cpp```
uses the "/exit" resource instead, but you MUST change that.
- Please stick with the file names embedded_cpp.cpp and
daemon.cpp when submitting - it may well work ok if you
don't but no harm being predictable:-)

### C++ Daemon

The reason we need the C++ version of this to be a daemon is so that
submitty can run the server and then the test client - submitty's
not that good at doing things in parallel, so we solve that by
making the server a daemon, which is a good thing to know about
anyway.

I took the ```daemon.cpp``` code from
[here](http://shahmirj.com/blog/beginners-guide-to-creating-a-daemon-in-linux)
which also explains what's going on. In contrast to the daemon code given
there, I've modified ```daemon.cpp``` so that the child process will exit, when
told to via HTTP.

Because we're using ```fork()``` and other system calls for
the daemon code, you probably really need to test your code
on a real Linux system before submitting and not only on a Windows-thing.

Sometimes when people use the
term daemon they mean a process run at startup, usually by some init/systemd/upstart
system, but here we only mean that the process forks a child then exits.

### Golang implementation

Your implementation should be in a single file called ```server.go```
but other options may work too.

There is a "net/http" package that makes coding up a simple web server
pretty trivial - the standard documentation even has almost all the
code you need.

There is a "crypto/rand" package that handles prime generation, so if
you go check the source for the ```Prime``` function, you'll find 
that you can copy and modify that fairly easily.

### Go daemon

Seems like this is sorta-controversial (not that systemd etc ever were:-).

What's worked for me was to use [goadaemon](https://github.com/VividCortex/godaemon)
but it only seems to work in the built/compiled version where is seems fine.
That is, ```go run server.go``` doesn't work with the daemon code, but 
```go build server.go``` does produce a ```server``` binary that seems to
do the right things.

Before using that one needs to:

		$ go get https://github.com/VividCortex/godaemon

And then the minimal code explained at the git repo seems to do the
job.

## Other hints...

- The "?vs=0x" part of the query string does not end up
as a part of the vanity prime. Those characters are just
there to a) make our query string handling consistent with
common use on the web, and b) the "0x" indicates we're
using ASCII hex encoding and so provides for potential
extension points later. (Not that there's a "later" for
this code:-)

- If the vanity string isn't syntactically correct (e.g. if it
has odd characters or an odd number of characters) then your
server ought return some form of error. I don't care what kind
of error you produce there (but an HTTP 4xx would be nice).

## What's here?

The files in this assignment directory you should see now are:

- [Makefile](Makefile)  - the Makefile to builld this HTML and compile Go code
- [README.html](README.html) - this HTML file
- [README.md](README.md) - the markdown source for this HTML file
- [c++](c++/) - this directory has C++ code for a daemonised HTTP server and a Makefile to get you started
- [sendone.sh](sendone.sh) - a Bash script to send a single request to a server 
- [sendem.go](sendem.go) - a client that requests and verifies a bunch of vanity primes
- [checkoneandexit.go](checkoneandexit.go) - a go program that sends a single request, 
	checks the answer, and then nicely asks the server to exit

## Deadline

The deadline for submission of this assignment is 2017-12-15 

## Submission

Again: You MUST ensure that your code exits cleanly *before* subitting
to submitty. If you don't figure that out, Christian or I may be irritated:-)
The reason for that is that submitty is not really designed for server
code assignments, so we're stretching things a bit and I'd really 
prefer that you not get in one another's way due to ports being bound
to hanging processes etc.

For this assignment you should submit your server.go file  
or your embedded_cpp.cpp and daemon.cpp files via the correct button 
as usual via [https://cs2014.scss.tcd.ie/](https://cs2014.scss.tcd.ie/).


