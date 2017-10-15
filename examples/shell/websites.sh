#!/bin/bash

set -x

# modified from https://serverfault.com/questions/282215/script-to-automatically-test-if-a-web-site-is-available downloaded from there on 20170922
# no idea of copyright

# SF changes
# - renamed ".lst" files to take out abs path, need to be put back for cron
# - added check of mailx being installed and cfg files being readable
# - added use of mktemp
# - 200 is not the only good response, 30x's tend to be too:-) Added -L to curl
# - added "https://" before the thing to check:-)

# check if the mail client we need is installed, and give
# an error if not
MAILX=`which mailx`
if [[ $? != 0 || $MAILX == "" ]]
then
	echo "$0: You need mailx - to get that 'sudo apt install mailutils'"
	exit 1
fi

# list of websites. each website in new line. leave an empty line in the end.
LISTFILE=websites.lst
# Send mail in case of failure to. leave an empty line in the end.
EMAILLISTFILE=emails.lst

if [[ ! -r $LISTFILE ]]
then
	echo "$0: Can't read $LISTFILE, please fix"
	exit 1
fi
if [[ ! -r $EMAILLISTFILE ]]
then
	echo "$0: Can't read $EMAILLISTFILE, please fix"
	exit 1
fi

WORKDIR=`mktemp -d /tmp/websitesXXXX`
if [[ ! -d $WORKDIR ]]
then
	echo "$0: mktemp failed to make $WORKDIR - odd that, exiting"
	exit 1
fi


# `Quiet` is true when in crontab; show output when it's run manually from shell.
# Set THIS_IS_CRON=1 in the beginning of your crontab -e.
# else you will get the output to your email every time
if [ -n "$THIS_IS_CRON" ]; then QUIET=true; else QUIET=false; fi

function test {
  response=$(curl -L --write-out %{http_code} --silent --output /dev/null https://$1)
  filename=$( echo $1 | cut -f1 -d"/" )
  if [ "$QUIET" = false ] ; then echo -n "$p "; fi

  if [ $response -eq 200 ] ; then
    # website working
    if [ "$QUIET" = false ] ; then
      echo -n "$response "; echo -e "\e[32m[ok]\e[0m"
    fi
    # remove .temp file if exist.
    if [ -f $WORKDIR/$filename ]; then rm -f $WORKDIR/$filename; fi
  else
    # website down
    if [ "$QUIET" = false ] ; then echo -n "$response "; echo -e "\e[31m[DOWN]\e[0m"; fi
    if [ ! -f $WORKDIR/$filename ]; then
        while read e; do
            # using mailx command
            echo "$p WEBSITE DOWN" | $MAILX -s "$1 WEBSITE DOWN" $e
            # using mail command
            #mail -s "$p WEBSITE DOWN" "$EMAIL"
        done < $EMAILLISTFILE
        echo > $WORKDIR/$filename
    fi
    # remove .temp file if exist.
    if [ -f $WORKDIR/$filename ]; then rm -f $WORKDIR/$filename; fi
  fi
}

# main loop
while read p; do
  test $p
done < $LISTFILE

# clean up workdir, but a little carefully - don't
# want to delete the working directory if that 
# env var got unset!
if [[ "$WORKDIR" != "" ]]
then
	rm -rf $WORKDIR
fi

