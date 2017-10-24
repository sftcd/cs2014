#!/bin/bash

# 
# Copyright (C) 2017 stephen.farrell@cs.tcd.ie
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.

# cs2014 location
REPO=$HOME/code/cs2014/

# mbedtls location
MBDIR=$REPO/assignments/assignment2/mbedtls-2.6.0/

# temp place for files
TDIR=`mktemp -d /tmp/keyplay-XXXX`

if [[ ! -d $TDIR ]]
then
	echo "Createing $TDIR failed - exiting"
	exit 1
else
	echo "Putting stuff in $TDIR"
fi

# generate an EC key pair
$MBDIR/programs/pkey/gen_key type=ec filename=$TDIR/ec.priv

# export the public key as it'd be in a coin
$MBDIR/programs/pkey/key_app_writer mode=private filename=$TDIR/ec.priv output_mode=public output_file=$TDIR/ec.pub output_format=der

# hexdump the public key
hd $TDIR/ec.pub


# clean up
rm -rf $TDIR


