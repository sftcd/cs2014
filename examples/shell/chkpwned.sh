#!/bin/bash

# A v. basic script to check if (the hash of) a password is present
# in the list of passwords previously leaked.
# The list of 320 million hashes has been released (20170804) from
# https://haveibeenpwned.com/Passwords for research purposes.


# initial list has 306 million entries
LIST=$HOME/data/pwned-passwords-1.0.txt
# update has another 14M, apparently with mixed-case variations
# that got missed when assembling the 306M list
UPDATE1=$HOME/data/pwned-passwords-update-1.txt

if [[ ! -f $LIST || ! -f $UPDATE1 ]]
then
	echo "Sorry, you need the lists, nothing to check for now"
	exit 1
fi


# If you do put a pwd on the command line, it'll be visible to
# ps, for about 30 seconds, so that's a bad plan:-)
if [[ $1 != "" ]]
then
	PWD=$1
else
	# Read Password without it being visible to system for a long time
	echo -n Password: 
	read -s PWD
	echo
	#PWD="password"
	#echo "checking $PWD"
fi

# note that the password is visible here briefly, FIXME
hash=`echo -n $PWD  | openssl sha1 | awk '{print $2}' | awk 'BEGIN { getline; print toupper($0) }'`
# maybe don't display this?
echo "Hash is $hash"

# There has to be a quicker way, but 30s isn't that bad
count1=`grep -c $hash $LIST`
count2=`grep -c $hash $UPDATE1`

count=$((count1+count2))

echo "Found $count occurrences in $LIST and $UPDATE1"

exit 0


