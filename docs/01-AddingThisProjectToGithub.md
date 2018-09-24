# Adding this Project to Github



##### Local File Structure

C:\dev\
​	mountaineering\
​		images\
​		scripts\main.js
​		styles\styles.css
​		index.html

#### Putting Project under Source control



##### Goto GIT and create REPO

https://github.com/ > New Repository
​	SoftDevJohn/mountaineering
​	(*) Public
​	[CHECKED] Initialize with a README

>Create Repository
>Clone or Download>Copy the address of the project which is:
>https://github.com/SoftDevJohn/mountaineering.git



##### Open command shell to initialse GIT in local PC Folder

cd C:\dev\mountaineering
git init
{this creates an empty local repository .gitin the current directory}

##### Add the files to GIT

git add -A

*("git add" stages modifications for the next "git commit")*

git commit -m "Added my initial mountaineering project"
4) Add Github link to my local git repoistory
git remote add origin https://github.com/SoftDevJohn/mountaineering.git

##### Push the files to Github

git push -u -f origin master
*NB: The -f overwrites everything on the Github repository, which is Ok, because this is the initial creation.



#### Adding extra files to Git

After creating the following files:

- README.md; 
- ./docs; and 
- ./docs/01-AddingThisProjectToGithub.md

These new files are untracked and not under source control.

##### Staging these files for the next commit

git add README.md

git add ./docs

git add ./docs/01-AddingThisProjectToGithub.md

These files are now tracked and ready to be committed to the local file system.

However, if we modify this file then the recent change will be untracked.

Running "git commit" commits the snapshot when the last "git add" was run. "git add" stages modifications to be commited by the next "git commit".

Commiting the staged files

git commit -m "Committing two new files"



