# Branching Model



## Branches

T

### Two main Branches

- master - production-ready state
- develop - latest delivered development changes that will go into the CI nightly build

When the source code in the 'develop' branch reaches a stable point and is ready for release, all the changes should be merged back into 'master' and tagged with a release number.
Every time a commit is made to 'master', this is a new production release.

### Three Supporting branches

- Feature - features being developed that will be merged back onto develop;

- Hotfix - bug fixes on branch taken from 'master' and merged back to 'master' and 'develop'; and

- Release - used for preparation of new production release. Branched from develop, last minute changes made and then merge into 'master'.


## Development lifecycle

### Initial setup

Create the development branch

git checkout master
git checkout -b develop master

### Walkthrough

In this scenario we add new documentation. All new stuff goes on the 'develop' branch. But first we need to create a feature branch to work on while updating our documentation.

#### Creating a new feature branch to work on our updates.

Branch the feature branch off 'develop'

`git checkout -b feature-docupdate develop`

Make the document changes and commit the changes.

Now merge the feature branch back into the develop branch, by checking out the develop branch.

`git checkout develop`

`git merge --no-ff feature-docupdate`

Delete the feature branch.

`git branch -d feature-docupdate`

Push our repo to the remote repo.

`git push origin develop`



#### Merging the develop branch with the master branch for a production release

A branch,'release-0.2', is created off the 'develop' branch to prepare for merging with the master. Last minute changes and bug fixes are made on this branch, but definitely no new features. Continued developmement continues on the 'develop' branch. Then this release branch is then merged back on to the 'master' branch.



`git checkout -b release-0.2 develop`
Bump up the version number immediately in my version.txt before doing anything else.
`git commit -a -m "Bumped version number to 0.2"`
Make whatever last minute changes are necessary to get this into production.

Commit the changes.

`git commit -a -m "Make a few production release changes"`

Now merge it on to the master, this is effectively a production release.

`git checkout master`
`git merge --no-ff release-0.2`

Now tag the release
git tag -a 0.2``

`Delete the branch`

git branch -d release-0.2

Push our repository, together with its tags, to the origin repository,

`git push origin --tags`



#### Quick Production Bug fixes

In this case we create a 'hotfix' branch off the 'master' and then merge it back on the 'master' and also on to the 'develop' branch.

`git checkout -b hotfix-0.1.1 master`

*We use the naming convention hotfix-*, which takes the existing version and append new minor number as bug fix.*

The first thing to do is bump up the version number and commit it. *In this example, I use a simple version.txt file.*

`git commit -a -m "Bumped version number to 0.2.1"`

Now make the urgent bug fixes and commit the changes.

`git commit -m "Fixed severe production bug"`

Now merge with the master

`git checkout master`
`git merge --no-ff hotfix-0.2.1`

Tag the release with the new version number

`git tag -a 0.2.1`

Also add the bug fix to the develop branch.

git checkout develop
git merge --no-ff hotfix-0.2.1
git branch -d hotfix-0.2.1



