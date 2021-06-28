const express = require("express");
const router = express.Router();
const db = require("../db/client");

/* GET users listing. */
router.get("/", (req, res, next) => {
  db.query("SELECT * from users;").then(({ rows }) => {
    res.send(rows);
  });
});
router.get("/:id", (req, res, next) => {
  db.query("SELECT * from users where id=$1;", [req.params.id]).then(
    ({ rows }) => {
      if (rows.length === 0) {
        return res
          .status(404)
          .send("Could not find the user with the id: " + req.params.id);
      }
      res.send(rows[0]);
    }
  );
});

router.post("/", (req, res, next) => {
  console.log(req.body);
  const { firstname, lastname } = req.body;
  if (!firstname || !lastname) {
    return res.status(400).send("A 'firstname' and a 'lastname' is required");
  }
  db.query(
    "INSERT INTO users (firstname, lastname) VALUES ($1, $2) RETURNING *",
    [firstname, lastname]
  )
    .then((result) => {
      console.log(result);
      res.send(result.rows[0]);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Failed to create the new user.");
    });
});

module.exports = router;
