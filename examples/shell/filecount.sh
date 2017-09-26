#!/bin/bash

# 
# Copyright (C) 2017 Stephen Farrell, stephen.farrell@cs.tcd.ie
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

# This counts and records the number of files below $HOME
# and reports the current count and average over time.

# Where to start counting from...
# My own $HOME is a bit big and takes ages for this so...
TOP=$HOME/code/cs2014

# where to keep the records
RECORDFILE=howmanyfiles.txt

# count the files and record the count and date in a file
find $TOP -type f  | wc | awk '{print $1 " " strftime("%Y-%m-%d") }' >>$RECORDFILE

# take today's count from last line...
lastcount=`tail -1 $RECORDFILE | awk '{print $1}'`
# take dates from first and last line...
lastdate=`tail -1 $RECORDFILE | awk '{print $2}'`
firstdate=`head -1 $RECORDFILE | awk '{print $2}'`

# figure out the average
average=`cat howmanyfiles.txt | awk '{ sum += $1; n++ } END { if (n > 0) print sum / n; }'`

# say what we found
echo "Between $firstdate and $lastdate, there were on average $average files below $TOP" 
echo "Last I looked (using $0) the total was $lastcount"

exit 0

