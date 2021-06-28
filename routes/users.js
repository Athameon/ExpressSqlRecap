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

module.exports = router;
