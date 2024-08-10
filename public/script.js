document.getElementById('csv-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const Credit_score = document.getElementById('credit_score').value;
  const Country = document.getElementById('country').value;
  const Gender = document.getElementById('gender').value;
  const Age = document.getElementById('age').value;
  const Tenure = document.getElementById('tenure').value;
  const Balance = document.getElementById('balance').value;
  const Credit_card = document.getElementById('credit_card').value;
  const Active_member = document.getElementById('active_member').value;
  const Estimated_salary = document.getElementById('estimated_salary').value;
  const Churn = document.getElementById('churn').value;
  const Products_number = document.getElementById('products_number').value;

  fetch('/csv-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Credit_score,
      Country,
      Gender,
      Age,
      Tenure,
      Balance,
      Credit_card,
      Active_member,
      Estimated_salary,
      Churn,
      Products_number
    }),
  })
  .then(data => {
    // Reset the form fields after successful data addition
    document.getElementById('csv-form').reset();
  })
    .catch((error) => {
      console.error('Error:', error);
      alert('An error occurred while saving the data');
    });
});
