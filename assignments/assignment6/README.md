<meta charset="utf-8" />

# CS2014 2017 Assignment6 - Socket Knocking on the door...

## Specification

Your assignment this time is to write a C++ program that connects
to a server on a TCP socket and logs the server's response 
to an HTTP GET request that you send it via the socket.

Your binary must take the following command line arguments, 
in both long and short form:

- h, host: the DNS name or IP address of the host to contact
- p, port: the TCP port on the server to which to connect

- w, web: make an HTTP GET request for the "/" resource
- f, file: store any output received from socket in file 

- H, help: produce a usage message such as that below
- ?, help: produce a usage message such as that below

And example usage string if your binrary is called ```knock``` is:

		$ ./knock -?
		usage: ./knock -h host -p port [-H] [-w] [-f file]

The mandatory parameters are the host and port.If
those are not supplied then you may return an error message,
or you may prompt the user to enter them.  
For other input parameters, you may prompt the user
or produce output to stdout as needed.

- The host input MUST be an IPv4 or IPv6 address or a Fully Qualified
Domain Name (FQDN)
- The port MUST be an integer between 1 and 65535

## Background

There's a nice sockets tutorial [here](http://www.bogotobogo.com/cplusplus/sockets_server_client.php)

It turns out there isn't a standard/portable C++ interface for networking, so
you have two choices here - to use the BSD/Posix C socket library from your C++
code, which is fine. Or you can sarch the web to see if you can find a C++
wrapper or other library that you can use. Either can work and you can get full
marks either way. Note that if the library needs to be installed in the OS, (as
opposed to being source files uploaded with your own code), then you'll need to get my ok, as I'd
need to install it on the machine that runs submitty. And I'll probably say
"no," unless there's a good reason, sorry.

My advice FWIW: knowing about the BSD sockets interfaces is well worth-while as
you'll benefit much more from that since many programming
languages/environments provide this same interface. So I'd suggest writing that
code from scratch and not cut'n'pasting someone else's code.

## Some hints...

- In our previous uses of Makefile, ```CC``` was the variable to set for the
  compiler, but for C++ the equivalent variable is ```CXX```.
- You'll find lots of examples of client and server code for using sockets
  online. My advice again: read those and understand them, but then write
  your own code and don't only cut'n'paste.
- While you only need to write client code for the assignment, you might
  want to also write server code so you can test locally. If you do that, great!
	- If you don't do that, well I guess it is ok to have your home-grown client
	  talk to e.g. www.tcd.ie port 80 or similar.
- I had a bug in my verifier code (thanks again Ed!:-) that's now (20171129) fixed.


## What's here?

The files in this assignment directory you should see now are:

- [Makefile](Makefile)  - the Makefile to builld the above and link in the mbed TLS library
- [README.html](README.html) - this HTML file
- [README.md](README.md) - the markdown source for this HTML file

## Deadline

The deadline for submission of this assignment is 2017-12-04

## Submission

For this assignment you should submit all of your *.cpp and *.h files  
via [https://cs2014.scss.tcd.ie/](https://cs2014.scss.tcd.ie/).
That means submitting all the source files needed for your program
to compile and run successfully.

You should ensure that compile instruction below works successfully in your working
directory (in addition to whatever you do yourself while developing):

		$ g++ -std=c++14 *.cpp

If that produces a working ```a.out``` then you're in with a shout
of passing the submitty tests and get marks. Otherwise,... you might not;-(


