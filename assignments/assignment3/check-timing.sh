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

#set -x

# do N runs of coin making and report average

NRUNS=10 # no idea how many needed for good average 
bits=17 # default
# temp place to keep timing info
timef=`mktemp /tmp/nruns.timesXXXX`

NOW=`date -u +%Y%m%d-%H%M%S`

CMD=./cs2014-coin

CARGS="-m -b $bits"

if [[ ! -f $timef ]]
then
	touch $timef
fi

echo "Running $0 at $NOW" 

echo "This'll take a few (maybe 10/20) seconds, please be patient"

total=0
badruns=0
badtotal=0

for (( iter=0; iter<NRUNS; iter++ ))
do
	resstr=`/usr/bin/time -a -o $timef -f "%e" $CMD $CARGS`
	res=$?
	runiters=`echo $resstr | grep iterations | awk '{print $(NF-1)}'`
	if [[ $res == 0 ]]
	then
		(( total += runiters ))
		# echo $iter $runiters
	else
		(( badruns ++ ))
		(( badtotal += runiters ))
	fi
done

(( goodruns = NRUNS - badruns )) 

(( average = total / ( NRUNS - errors) ))

if (( badruns > 0 )) 
then
	echo "We had $badruns errors"
fi

echo "Average of $average iterations at difficulty $bits over $goodruns runs"

# for speed purposes we do count bad runs too

# reported as n.nn seconds, the last sed loses the decimal point
# so we're measuring in milli seconds for now 
totalwalltime=`cat $timef |  awk '{ sum += $1; n++ } END { if (n > 0) print sum ; }' | sed -e 's/\.//'`
(( totalwalltime *= 10 ))
(( overalliters = total + badtotal ))
(( hps = 1000*overalliters / totalwalltime ))

echo "Timing vs. openssl's sha256 (on 256 byte blocks)"

echo "Wall time: $totalwalltime (ms) Ovarall iterations (incl. fails): $overalliters"

echo "Our iterations per second: $hps"

# time openssl
ohps=`openssl speed sha256 -mr 2>&1 | head -6 | tail -1  | awk -F':' '{print $2/$4}'`

echo "Openssl's sha256 hashes per second: $ohps" 

# clean up
rm -f $timef


