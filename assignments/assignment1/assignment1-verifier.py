#!/usr/bin/python

# 
# Copyright (c) 2017 stephen.farrell@cs.tcd.ie
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
# 

import sys
import re

# read in a file (maybe stdin) and verify formatting is as per 
# assignment1 requirementso

finished=False

arraycount=0
firstline=True
midline=False
lastline=False
blankline=False
inlinearraycount=0
arraylen=0
nlines=0
midssofar=0
errored=False

with open(sys.argv[1], 'r') if len(sys.argv) > 1 else sys.stdin as f:
    for line in f:
        toks=re.sub(r'\s','',line).split(',')
        #print toks
        if firstline:
            # first line of an array is decimal-line-no, hex-array-len
            inlinearraycount=int(toks[0])
            if arraycount != inlinearraycount :
                print "Error at array:", arraycount
                errored=True
                break
            arraylen=int(toks[1],16)
            if arraylen==0:
                blankline=True
                firstline=False
                continue
            nlines=(arraylen-1)//8
            firstline=False
            #print "arraycount: ",arraycount,"arraylen:",arraylen,"nlines:",nlines
            midssofar=0
            if nlines != 0:
                midline=True
                firstline=False
            else:
                firstline=False
                lastline=True
            #print "count: ", inlinearraycount, "arraylen: ",arraylen
            continue
        if midline:
            if len(toks)!=9:
                print "Error at midline:", arraycount
                errored=True
                break
            for i in range(0,7):
                val=int(toks[i],16)
                if (val<0) or (val>255):
                    print "Value Error at midline:", arraycount
                    errored=True
                    break
            midssofar += 1
            #print "midssofar: ", midssofar
            if midssofar == nlines:
                midline=False
                lastline=True
            continue
        if lastline:
            lastn=arraylen % 8
            #print "lastn: ",lastn
            if lastn == 0:
                # nothing more
                lastline=False
                blankline=True
            else:
                if len(toks) != lastn:
                    print "Value Error at lastline:", arraycount, lastn
                    errored=True
                    break
                for i in range(0,lastn-1):
                    val=int(toks[i],16)
                    if (val<0) or (val>255):
                        print "Value Error at lastline:", arraycount, val, i
                        errored=True
                        break
            lastline=False
            blankline=True
            continue
        if blankline:
            if len(toks) != 1:
                print "Value Error at blankline:", arraycount
                errored=True
                break
            blankline=False
            firstline=True
            arraycount += 1
            continue
        # now read arraylen blocks of 8
        arraycount += 1

if not errored:
   print "Passed! read", arraycount, "entries"
else:
   print "Bummer: error at ", arraycount

if f is not sys.stdin:
    f.close()
