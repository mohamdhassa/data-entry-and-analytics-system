const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse JSON request bodies
app.use(express.json());

// Route to handle CSV data operations
app.post('/csv-data', (req, res) => {
  const { firstName, lastName, price, sale } = req.body;

  // Load data from the CSV file
  let data = [];
  let nextId = 1;
  try {
    fs.createReadStream('output.csv')
      .pipe(csv())
      .on('data', (row) => {
        data.push(row);
        nextId = Math.max(nextId, parseInt(row.ID) + 1);
      })
      .on('end', () => {
        // Get the current timestamp
        const timestamp = new Date().toLocaleString();

        // Add the new row to the data with timestamp
        data.push({ ID: nextId, 'First Name': firstName, 'Last Name': lastName, Price: price, 'Sale': sale, 'Input Time': timestamp });

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
  const headers = Object.keys(data[0]); // Get headers from the first row
  csvRows.push(headers.join(',')); // Add headers to the CSV

  for (const row of data) {
    const values = headers.map((header) => row[header]); // Get values for each header
    csvRows.push(values.join(',')); // Add values to the CSV
  }

  return csvRows.join('\n'); // Join rows with newline characters
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
