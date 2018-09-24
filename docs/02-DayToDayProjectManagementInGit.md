# Day to Day tricks for managing a git project



#### Ignoring file  (like binaries)

Only files which are stages ("git add") will be committed, however it can be a nuisance seeing the same untracked files that you never want to stage and commit.

On the PC there is a file which I want to ignore called ./docs/"DummyFile.txt".

In the top-level directory (C:\dev\mountaineering), create "gitignore.txt" and in a command shell "ren gitignore.txt .gitignore", as windows doesn't allow no-name files to be created in file explorer.

Add the list of files to be ignored as

`DummyFile.txt`

Doing "git status" will no longer show this file as untracked.

Commit everything now including the .gitignore.



#### Git Visual Tools

File Manager will show icons beside files.

For example, the file:

C:\dev\mountaineering\docs\02-DayToDayProjectManagementInGit.md

will show a red icon with an exclamation mark when the file has been modied.

Right-Click on the file and Git Commit -> "master" ... and in the window that opens, enter a message.

