const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Path to the Jupyter Notebook file
const notebookPath = path.join('C:', 'Users', 'USER', 'Desktop', 'nn', 'nn', 'bb.ipynb');

// Path to the output CSV file
const csvFile = path.join('C:', 'Users', 'USER', 'Desktop', 'nn', 'nn', 'output.csv');

// Function to check if the CSV file has a new row
function checkNewRow() {
  try {
    const lines = fs.readFileSync(csvFile, 'utf-8').split('\n');
    return lines.length > 1;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    }
    throw err;
  }
}

// Function to run the Jupyter Notebook
function runNotebook() {
  exec(`jupyter nbconvert --to notebook --execute --inplace ${notebookPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running the Jupyter Notebook: ${error}`);
    } else {
      console.log(stdout);
    }
  });
}

// Main loop
function main() {
  setInterval(() => {
    if (checkNewRow()) {
      console.log(`${new Date().toISOString()} - New row detected in ${csvFile}, running ${notebookPath}`);
      runNotebook();
    }
  }, 10000); // Check for new rows every 10 seconds
}

main();


