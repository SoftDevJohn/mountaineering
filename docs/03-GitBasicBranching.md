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

`git checkout master`

*All the changes in the current directory are lost as the local directory directory is now reflective of what is on master. But don't worry as all the local changes were committed on the hotfix branch, which we can get back at anytime.*

With the current directory set to the master branch, we can merge from the hotfix branch.

`git merge hotfix`

The specified branch 'hotfix' has now been merged into the current branch 'master' and the current directory now shows all the branched files from the 'hotfix' branch.

As this branch is no longer needed, it can be deleted

`git branch -d hotfix`

Push my local repository to the origin repository.
`git push`





























