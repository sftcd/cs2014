# 
# Copyright (c) 2013 No Face Press, LLC
# License http://opensource.org/licenses/mit-license.php MIT License
#

#This makefile is used to test the other Makefiles


PROG = embedded_cpp
SRC = embedded_cpp.cpp daemon.cpp

# set this to where you built the civetweb repo
TOP = ../civetweb
CIVETWEB_LIB = libcivetweb.a

# set this to where you built the mbedtls repo
MT=/var/local/extra/mbedtls-2.6.0/
MI=$(MT)/include/
ML=$(MT)/library/

CFLAGS = -g -I$(MI) -I$(TOP)/include $(COPT)
LIBS = -L$(ML) -lmbedcrypto -lmbedtls -lpthread


include $(TOP)/resources/Makefile.in-os

ifeq ($(TARGET_OS),LINUX) 
	LIBS += -ldl
endif

all: $(PROG)

$(PROG): $(CIVETWEB_LIB) $(SRC)
	$(CXX) -o $@ $(CFLAGS) $(LDFLAGS) $(SRC) $(CIVETWEB_LIB) $(LIBS)

$(CIVETWEB_LIB):
	$(MAKE) -C $(TOP) clean lib WITH_CPP=1
	cp $(TOP)/$(CIVETWEB_LIB) .

clean:
	rm -f $(CIVETWEB_LIB) $(PROG)

.PHONY: all clean
