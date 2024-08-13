const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse JSON request bodies
app.use(express.json());

// Route to handle CSV data operations
app.post('/csv-data', (req, res) => {
  const { Credit_score, Country, Gender,
    Age, Tenure, Balance, Products_number, Credit_card, Active_member, Estimated_salary, Churn } = req.body;

  // Load data from the CSV file
  let data = [];
  let nextId = 1;
  try {
    fs.createReadStream('output.csv')
      .pipe(csv())
      .on('data', (row) => {
        data.push(row);
        nextId = Math.max(nextId, parseInt(row.customer_id) + 1); 
      })
      .on('end', () => {
        // Add the new row to the data
        data.push({ 
          'customer_id': nextId, 
          'credit_score': Credit_score, 
          'country': Country,
          'gender': Gender, 
          'age': Age, 
          'tenure': Tenure, 
          'balance': Balance, 
          'credit_card': Credit_card,
          'active_member': Active_member, 
          'estimated_salary': Estimated_salary, 
          'products_number': Products_number, 
          'churn': Churn 
        }); 

        // Write the updated data to the CSV file
        fs.writeFile('output.csv', convertToCSV(data), (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error saving data to CSV file');
          } else {
            res.status(200).send('Data saved to CSV file');
          }
        });
      });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error reading CSV file');
  }
});

function convertToCSV(data) {
  const csvRows = [];
  const headers = Object.keys(data[0]); 
  csvRows.push(headers.join(',')); 

  for (const row of data) {
    const values = headers.map((header) => row[header]); 
    csvRows.push(values.join(',')); 
  }

  return csvRows.join('\n'); 
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

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
        console.error(`stderr: ${stderr}`);
      } else {
        console.log(`stdout: ${stdout}`);
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
});