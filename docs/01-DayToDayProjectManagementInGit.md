# Day to Day tricks for managing a git project



#### Ignoring file  (like binaries)

Only files which are stages ("git add") will be committed, however it can be a nuisance seeing the same untracked files that you never want to stage and commit.

On the PC there is a file which I want to ignore called "DummyFile.txt".

In the top-level directory (C:\dev\mountaineering), create "gitignore.txt" and in a command shell "ren gitignore.txt .gitignore", as windows doesn't allow no-name files to be created in file explorer.

