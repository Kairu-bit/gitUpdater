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

  // Pull the latest changes
  const status = await git.pull();
  console.log(`Status:`, status)

  if (status.summary.changes === '0') {
    console.log(getTimeStamp() + info + `No updates found.`);
  } else {
    // Get the latest commit message
    const log = await git.log(['-1']);
    const commitMessage = log.latest.message;
    console.log(getTimeStamp() + info + "Update successful. Please run the script again using: " + yellow + "node index.js");
    console.log(getTimeStamp() + info + `Update Message: ${green + commitMessage}`);
    process.exit();
  }
} catch (err) {
  console.log(getTimeStamp() + error + "Update failed");
  console.log(getTimeStamp() + error + err.message);
  process.exit();
}
