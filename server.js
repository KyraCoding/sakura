const express = require("express");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

const app = express();

app.get("/team/:id", async (req, res) => {
  const id = req.params.id;
  const url = "https://ctftime.org/team/" + id;
  const response = await fetch(url);
  const body = await response.text();
  const $ = cheerio.load(body);
  const data = {};
  data.id = id;
  data.team_name = $("h2").text().substring(1);
  var global_rank = $("p:contains('Overall rating place:')")
    .text()
    .replace(/\s+/g, " ")
    .trim();
  data.global_rank = global_rank.substring(
    global_rank.indexOf(":") + 2,
    global_rank.indexOf("with") - 1
  );

  data.rating_points = global_rank.substring(
    global_rank.indexOf("with") + 5,
    global_rank.indexOf("pts") - 1
  );
  
  var country_rank = $("p:contains('Country place:')")
    .text()
    .replace(/\s+/g, " ")
    .trim();
  data.country_rank = country_rank.substring()
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(data, null, 4));
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Catch all, send 404
app.all("*", (req, res) => {
  res.status(404).send("<h1>404! Page not found</h1>");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
