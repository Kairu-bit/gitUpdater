import simpleGit from 'simple-git';

const git = simpleGit();
const getTimeStamp = () => `[${new Date().toISOString()}] `;
const info = '[INFO] ';
const error = '[ERROR] ';
const yellow = '\x1b[33m';
const green = '\x1b[32m';
const reset = '\x1b[0m';

try {
  console.log(getTimeStamp() + info + `Checking for updates...`);

  // Check for changes in `setup.sh`
  let hasChanges = false;
  const diffSetup = await git.diff(['--name-only', '--', 'setup.sh']);
  if (diffSetup.includes('setup.sh')) {
    console.log(getTimeStamp() + info + 'Local changes detected in setup.sh. Stashing...');
    await git.stash();
    hasChanges = true;
  }

  // Check for changes in `index.js`
  const diffIndex = await git.diff(['--name-only', '--', 'index.js']);
  if (diffIndex.includes('index.js')) {
    console.log(getTimeStamp() + info + 'Local changes detected in index.js');
    process.exit(1)
  }

  // Perform git pull
  const pullResult = await git.pull();
  if (pullResult.summary.changes === 0) {
    console.log(getTimeStamp() + info + `No updates found.`);
  } else {
    const log = await git.log({ maxCount: 1 });
    const commitMessage = log.latest.message;
    console.log(getTimeStamp() + info + "Update successful. Please run the script again using: " + yellow + "<command>" + reset);
    console.log(getTimeStamp() + info + `Update Message : ${green + commitMessage + reset}`);

    // Reapply stashed changes if any
    if (hasChanges) {
      try {
        const res = await git.stash(['pop']);
        console.log(res);
      } catch (err) {
        console.log(getTimeStamp() + error + 'Failed to apply stashed changes.');
        console.log(getTimeStamp() + error + err.message);
      }
    }

    process.exit();
  }
} catch (err) {
  console.log(getTimeStamp() + error + "Update failed.");
  console.log(getTimeStamp() + error + err.message);
  process.exit();
}

