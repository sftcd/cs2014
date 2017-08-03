#!/bin/bash

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

