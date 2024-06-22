const express = require('express');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const app = express();


app.get('/team/:id', async (req, res) => {
  const id = req.params.id;
  const url = 'https://ctftime.org/team/'+id;
  const response = await fetch(url);
  const body = await response.text();
  const $ = cheerio.load(body);
  console.log($('.tab-content')[0])
  res.send("done!")
});
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

// Catch all, send 404
app.all('*', (req, res) => {
  res.status(404).send('<h1>404! Page not found</h1>');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});