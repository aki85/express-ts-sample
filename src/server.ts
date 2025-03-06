import express from "express";
import sqlite3 from "sqlite3";

const app = express();
app.use(express.json());

const db = new sqlite3.Database("./database.db");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/cats", (req, res) => {
  db.all("SELECT * FROM cats", (err, rows) => {
    res.send(rows);
  });
});

app.get("/cats/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM cats WHERE id = ?", id, (err, row) => {
    if (row) {
      res.send(row);
    } else {
      res.sendStatus(404);
    }
  });
});

app.post("/cats", (req, res) => {
  const { name, feature } = req.body;
  db.run(
    "INSERT INTO cats (name, feature) VALUES (?, ?)",
    [name, feature],
    function () {
      res
        .setHeader("Location", `http://localhost:3000/cats/${this.lastID}`)
        .sendStatus(201);
    }
  );
});

app.put("/cats/:id", (req, res) => {
  const { id } = req.params;
  const { name, feature } = req.body;
  db.run(
    "UPDATE cats SET name = ?, feature = ? WHERE id = ?",
    [name, feature, id],
    function () {
      res.sendStatus(204);
    }
  );
});

app.delete("/cats/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM cats WHERE id = ?", id, function () {
    res.sendStatus(204);
  });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});