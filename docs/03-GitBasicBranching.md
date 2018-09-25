# Basic Branching

Change to to the branch 'master' and retrieve the files form master on to current working directory.

`git checkout master`



Create a new branch 'hotfix' off master.

`got checkout -b hotfix`



Make some changes to some files.

Commit those changes.
`git commit -a -m "added more documentation hotfix branch"`

*Now the branch 'hotfix' has the latest changes, but the master branch does't.*

All my local changes have been committed on the hotfix branch which is what is in my current directory. Next we need to **change to the directory that we want to merge into**.

git checkout master





















