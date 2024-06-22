const express = require('express');

const app = express();


app.get('/team/:name', (req, res) => {
  res.send(`Name: ${req.params.name}`);
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