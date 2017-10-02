#!/bin/bash

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

# verify format

# set -x

finished=false;
count=0;

while [[ $finished == false ]]
do
        IFS=',\n';
        read entry hexrands;
        if [[ $? != 0 ]]
        then
                break;
        fi
        if [[ $count != $entry ]]
        then
                echo "Bummer at entry $entry";
                exit 1;
        fi

        #echo "hex: $hexrands";
        nrands=`echo "ibase=16; ${hexrands^^}" | bc`;
        #echo "decimal: $nrands";

        if (( nrands == 0 ))
        then
                read emptyline;
        else
                for (( rc=0; rc < ( nrands-1 ); rc++ ))
                do
                        #echo "reading $rc";
                        read -d, rval;
                        #echo "read: $rval";
		done
                # read last one
                if (( nrands!=1 && (nrands%8) == 1 ))
		then
                        read emptyline;
                fi
                read rval;
                #echo "last rval was $rval";
                read emptyline;
        fi

        count=$((count+1));

done < "${1:-/dev/stdin}"

echo "Passed! read $count entries";

exit 0
