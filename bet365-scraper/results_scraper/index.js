const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Results Scraper is running');
});

app.listen(port, () => {
  console.log(`Results Scraper listening at http://localhost:${port}`);
});
