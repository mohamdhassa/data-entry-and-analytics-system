document.getElementById('csv-form').addEventListener('submit', (event) => {
    event.preventDefault();
  
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const price = document.getElementById('price').value;
    const sale = document.getElementById('sale').value;

    fetch('/csv-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, price,sale }),
    })
      .then((response) => {
        if (response.ok) {
          alert('Data saved to CSV file');
        } else {
          alert('Error saving data to CSV file');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while saving the data');
      });
  });