import git from "simple-git";
import path from "path";

const repoPath = process.cwd();

const git = simpleGit(repoPath);

git.checkout(['main']);

git.pull('origin', 'main', (err, result) => {
  if (err) {
    console.error('Error pulling updates:', err);
  } else {
    console.log('Repository is up to date.');

    // Get the latest commit messages
    git.log(['-1'], (err, log) => {
      if (err) {
        console.error('Error getting commit messages:', err);
      } else {
        console.log('Latest commit message(s):');
        log.forEach(commit => {
          console.log(`- ${commit.message}`);
        });
      }
    });
  }
});


