const express = require("express");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

const app = express();

app.get("/api/team/:id", async (req, res) => {
  const id = req.params.id;
  const url = "https://ctftime.org/team/" + id;
  const response = await fetch(url);
  const body = await response.text();
  const $ = cheerio.load(body);
  const data = {};
  
  // General stuff
  data.id = id;
  data.team_name = $("h2").text().substring(1);
  data.pfp = $(".span2 > img").attr("src");
  data.description = $(".span12").find("p").text();

  // Global stuff
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

  // Per country stuff
  var country_rank = $("p:contains('Country place:')")
    .text()
    .replace(/\s+/g, " ")
    .trim();
  data.country_rank = country_rank.substring(country_rank.indexOf(":") + 2);
  data.country = $("p:contains('Country place:')")
    .find("a")
    .attr("href")
    .substring(
      $("p:contains('Country place:')")
        .find("a")
        .attr("href")
        .indexOf("/stats/") + 7
    );

  // Competition stuff
  data.competitions = [];
  var competitions = $("table").eq(0);
  var compHeaders = competitions.children("tr").eq(0).children("th");
  for (var i = 1; i < competitions.children("tr").length; i++) {
    var event = {};
    const row = competitions.children("tr").eq(i).children("td");
    for (var a = 1; a < row.length; a++) {
      event[
        compHeaders
          .eq(a - 1)
          .text()
          .toLowerCase()
          .replace(/\s+/g, "_")
          .trim()
      ] = row.eq(a).text();
    }
    data.competitions.push(event);
  }

  // Members stuff
  data.current_members = [];
  var current_members = $("table").eq(1).children("tr");
  for (var i = 0; i < current_members.length; i++) {
    var user = {};
    user.name = current_members.eq(i).children("td").text();
    user.id = current_members.eq(i).find("a").attr("href").substring(6);
    data.current_members.push(user);
  }
  data.former_members = [];
  var former_members = $("table").eq(2).children("tr");
  for (var i = 0; i < former_members.length; i++) {
    var user = {};
    user.name = former_members.eq(i).children("td").text();
    user.id = former_members.eq(i).find("a").attr("href").substring(6);
    data.former_members.push(user);
  }

  // Send it to the user!
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
