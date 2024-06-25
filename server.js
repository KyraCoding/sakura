const express = require("express");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
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
  data.country = $(".page-header")
    .find("img")
    .attr("src")
    .substring(
      $(".page-header").find("img").attr("src").indexOf("/f/") + 3,
      $(".page-header").find("img").attr("src").indexOf(".png")
    );

  // Yearly stuff
  var years = $(".nav-tabs").eq(0).children("li");
  for (var index = 0; index < years.length; index++) {
    data[years.eq(index).find("a").text()] = {};
    var this_year = data[years.eq(index).find("a").text()];
    this_year.year = years.eq(index).find("a").text();

    // Global stuff
    var year_div = $("#rating_" + this_year.year);
    var global_rank = year_div
      .children("p")
      .eq(0)
      .text()
      .replace(/\s+/g, " ")
      .trim();
    this_year.global_rank = global_rank.substring(
      global_rank.indexOf(":") + 2,
      global_rank.indexOf("with") - 1
    );

    this_year.rating_points = global_rank.substring(
      global_rank.indexOf("with") + 5,
      global_rank.indexOf("pts") - 1
    );

    // Per country stuff
    var country_rank = year_div
      .children("p")
      .eq(1)
      .text()
      .replace(/\s+/g, " ")
      .trim();
    this_year.country_rank = country_rank.substring(
      country_rank.indexOf(":") + 2
    );

    // Competition stuff
    this_year.competitions = [];
    var competitions = year_div.find("table");

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
      this_year.competitions.push(event);
    }

    // Members stuff
    data.current_members = [];
    var current_members = $("#recent_members").children("table").children("tr");
    for (var i = 0; i < current_members.length; i++) {
      var user = {};
      user.name = current_members.eq(i).children("td").text();
      user.id = current_members.eq(i).find("a").attr("href").substring(6);
      data.current_members.push(user);
    }
    data.former_members = [];
    var former_members = $("#past_members").children("table").children("tr");
    for (var i = 0; i < former_members.length; i++) {
      var user = {};
      user.name = former_members.eq(i).children("td").text();
      user.id = former_members.eq(i).find("a").attr("href").substring(6);
      data.former_members.push(user);
    }
  }

  // Send it to the user!
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(data, null, 4));
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/home.html");
});
app.get("/team", (req, res) => {
  res.sendFile(__dirname + "/team.html");
});
app.get("/team/:id", (req, res) => {
  res.sendFile(__dirname + "/team.html");
});
app.get("/user", (req, res) => {
  res.sendFile(__dirname + "/user.html");
});
app.get("/user/:id", (req, res) => {
  res.sendFile(__dirname + "/user.html");
});
const options = {
  definition: {
    openapi: "3.1.0",
    servers: [
      {
        url: "https://ctftime.glitch.me/",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);
app.use("/api", swaggerUi.serve, swaggerUi.setup(specs));

// Point of no return for routes

// Catch all, send 404
app.all("*", (req, res) => {
  res.status(404).send("<h1>404! Page not found</h1>");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
