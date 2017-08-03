
#First things to do in [Ubuntu](https://www.ubuntu.com/)

This is an example from my course on systems 
programming (<a href="https://down.dsg.cs.tcd.ie/cs2014">CS2014</a>),
the canonical URL for this is 
<a href="https://down.dsg.cs.tcd.ie/cs2014/examples/shell/README.html">here</a>.

If you're installing Ubuntu on a machine at home (a good thing to do) then
you'll be after things like [HOWTO make an install USB
stick](https://askubuntu.com/questions/307802/how-to-install-ubuntu-on-a-usb-stick),
and [things to do after installing
Ubuntu](http://www.omgubuntu.co.uk/2016/04/10-things-to-do-after-installing-ubuntu-16-04-lts).
Those are fine things but here we'll assume you've installed Ubuntu 16.04 or
better, i.e. we assume the machines in LG12.


##Files in this example:

- README.md - this file in markdown format
- README.html - this file, in HTML format (```'make html'``` to update that from .md)
- Makefile - to build the example and HTML (there's a clean target too)

After running ```'make'``` then this file will be produced (if all
goes well):

##Log in to the system

You should have your username and password, let's say those are
```student100``` and whatever you've been given for a password.
Logging in to the GUI is pretty obvious (I hope:-).

Once logged in, you want to get a command line/shell. There are
GUI based ways to fire up a shell, but ```ctrl-alt-t``` also
works and is useful in case there's no obvious icon for a command
line/shell. (There are loads of online guides to getting 
started with the shell, [here's](http://www.makeuseof.com/tag/a-quick-guide-to-get-started-with-the-linux-command-line/) one.

Once you have a shell, you'll see a prompt, something like:

		student100:~$ _ 

From there you can type commands to the shell.

The shell is (mostly) just another program that  interprets
your commands and runs the relevant programs, so e.g. if
you want to know where your "home" directory is on the
disk you can type:

		student100:~$ /bin/pwd
		/home/student100

And you see that the directory ```/home/student100``` is,
as you might expect, your home directory. (Your home
directory is also stored in an [environment variable](https://www.digitalocean.com/community/tutorials/how-to-read-and-set-environmental-and-shell-variables-on-a-linux-vps), so 
this also works:

		student100:~$ echo $HOME
		/home/student100


You can now use the ```man``` command to get some
help, or search online for loads of explanations as to
how to use a shell.

You'll also need to be non-dumb of course, as there
are commands that can delete or break things. (Hopefully
not too badly in the lab!) The ```rm``` command in
particular is one to be careful of, especially if you
ever tell it to delete an entire directory tree via
the ```-rf``` [command line option](https://blog.mafr.de/2007/08/05/cmdline-options-in-shell-scripts/)!
So: BE CAREFUL!

There are a variety of different shells available, with
minor variations in syntax when you start to use more
complicated commands and scripting. I use the ```bash```
shell myself and am happy with that, you may choose
another one. There's a ```chsh``` command that you
can use to change the shell you're using, check out
it's man page if you want to switch.

You can also personalise the shell (e.g. to set the
kind of prompts I show here), usually via editing
a "hidden" file in your home directory. In the case
of the bash shell, that file is ```$HOME/.bashrc```.
("Hidden" file names start with a dot and are 
not displayed by the ```ls``` command unless you
ask to see 'em via the ```-a``` command line option.
They useful so as to not clutter things up, but
are just normal files in the filesystem otherwise.)

As a last preliminary, you can change your password
via the ```passwd``` command. If you've been given
a crappy easily guessed password, then changing
that is probably a good plan. But if you forget
your new password, expect me, the TA and demonstrators
to be unhappy with you! 

You should also expect
that someone else is likely to try guess your password,
especially if a system is accessible to the 
Internet via SSH and allows password logins. In
that case, the chances are that brute-force password attacks
will be made against the system every few minutes.
(As correctly stated [here:](https://serverfault.com/questions/801546/someone-is-trying-to-brute-force-ssh-access-to-my-server)
"Unfortuntately, this is absolutely normal and something every SSH server experiences. Welcome to the internet.";-)
 
Most systems should have tooling to avoid that problem, but
not all do, and you as a user don't know when a
system is well protected or not - so ONLY EVER USE
STRONG PASSWORDS!

The next thing we want to do is clone the github repository
for the course and then run the [broken malloc](../bm/README.html)
example.

##Clone [this repo](https://github.com/sftcd/cs2014)...

I usually keep repositories like this in a ```code```
directory below my home directory so...

		student100:~$ mkdir code	
		student100:~$ cd code	

Another abbreviation for $HOME is the tilda character (```~```) which 
is why that may be part of the prompt depending on
your preferences. So, if you're logged in as student100, the following names for that
```code``` directory are equivalent:

		/home/student100/code/
		~/code/
		$HOME/code/

Of course for ```student666```, ```$HOME/code```
and ```~/code``` will refer to ```/home/student666/code/``` instead.

Now you want to get a copy of this repository:

		student100:~/code$ git clone https://github.com/sftcd/cs2014.git
		Cloning into 'cs2014'...
		remote: Counting objects: 139, done.
		remote: Compressing objects: 100% (89/89), done.
		remote: Total 139 (delta 73), reused 111 (delta 48), pack-reused 0
		Receiving objects: 100% (139/139), 714.98 KiB | 587.00 KiB/s, done.
		Resolving deltas: 100% (73/73), done.

The output you see will differ from the above as I'll have modified
the repo by then.

And now you can go build and run the first ```broken-malloc``
example:

		student100:~/code$ cd cs2014/examples/bm
		student100:~/code/cs2014/examples/bm$ make
		gcc     broken-malloc.c broken-malloc.h   -o broken-malloc
		student100:~/code/cs2014/examples/bm$ ./broken-malloc 
		Malloc 1 succeeded!
		Malloc 2 failed!
		Malloc 3 succeeded!
		Malloc 4 succeeded!
		Malloc 5 failed!
		Malloc 6 succeeded!
		Malloc 7 succeeded!
		Malloc 8 succeeded!
		Malloc 9 succeeded!
		Malloc 10 succeeded!
		Tests: 10, fails: 2
		student100:~/code/cs2014/examples/bm$ 

Yay! Success!

From now on, for clarity, I'll just show prompts as ```$``` and
omit the rest of the verbiage. (That stuff is useful though if
you have a number of windows with a shell open, so's you don't
type a command into the wrong place.)

Once you've gotten this far, I'd suggest you play about with the
```broken-malloc``` example, and see what you can change. Trying to
implement and test the ```realloc()``` function is a fine
plan.
If you manage to make it better (or interestingly different),
and you have a github.com account,
then feel free to submit a [pull-request](https://help.github.com/articles/about-pull-requests/) (PR) and if it's good I'll
accept that and maybe use it another year. Put your name
somewhere in the PR I can see it, so's I know who's submitted
what. (I'll even take typo-fixes, as I'm pretty bad at getting
rid of all the typos in my text/code;-)

##Editing files... probably using ```vi```

In order to play about with the example, you need a way to
edit files. My preferred tool for that is ```vi``` which is
a venerable editor that is still excellent today. 
There are loads of [vi cheatsheets](https://www.smashingmagazine.com/2010/05/vi-editor-linux-terminal-cheat-sheet-pdf/)
available online and spending a bit of time getting 
familiar with ```vi``` is well worthwhile - you'll be
using it for many years to come, so getting speedy at
editing with it is really a MUST. You don't need to
do all that at first though, it's fine to learn as you
go and get faster later.

Anyway, if
you wanted to edit the ```broken-malloc.h``` file
then you simply say ```vi broken-malloc.h``` while in
the right directory and off you go. If you've not
checked out a cheatsheet, you'll likely get stuck
there and never figure out that to exit the editor
without saving changes you need to type ```:q!```,
and to exit saving changes it's: ```:wq```

If you've not used ```vi``` before this is a really
good thing to ask about in the first lab.

There are plenty of other editors available on many
linux systems, from the most basic ```ed``` to 
```emacs``` which I think is a bit of a monster. Many
people though just love and swear by ```emacs```  (for
too much information about emacs, go [here](https://www.gnu.org/software/emacs/).)
In any case, 
try out various editors if you like and see which you find most comfortable.

BTW, ```ed``` is something I've not used in 
many years, and you'll only likely need to use it
if editing a file over a gigantically crappy network
that's dropping almost all packets or that has
multiple satellite hops on the path. But the
fact that tool is still there shows up a strength
of UNIX and GNU/Linux - pretty much no matter what
scenario you hit, there's a tool that works as well
as can be expected for that scenario.



