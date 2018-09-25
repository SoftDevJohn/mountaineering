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

git checkout -b feature-docupdate develop

Make the document changes and commit the changes.

Now merge the feature branch back into the develop branch, by checking out the develop branch.

git checkout develop

git merge --no-ff feature-docupdate

Delete the feature branch.

git branch -d feature-docupdate
git push origin develop



#### Merging the develop branch with the master branch for a production release



