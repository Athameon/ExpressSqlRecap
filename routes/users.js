const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const db = require("../db/client");

const getSingleUser = async (id) => {
  return await db.query("SELECT * from users where id=$1;", [id]);
};

/* GET users listing. */
router.get("/", (req, res, next) => {
  db.query("SELECT * from users;").then(({ rows }) => {
    res.send(rows);
  });
});
router.get("/:id", (req, res, next) => {
  getSingleUser(req.params.id).then(({ rows }) => {
    if (rows.length === 0) {
      return res
        .status(404)
        .send("Could not find the user with the id: " + req.params.id);
    }
    res.send(rows[0]);
  });
});

const validateBody = [
  body("firstname")
    .isLength({ min: 3 })
    .withMessage("You must provide a 'firstname' with at least 3 caracters."),
  body("lastname")
    .isLength({ min: 3 })
    .withMessage("You must provide a 'lastname' with at least 3 caracters."),
];

router.post("/", validateBody, (req, res, next) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { firstname, lastname } = req.body;
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

router.put("/:id", validateBody, (req, res, next) => {
  console.log("Request delete for user with id: ", req.params.id);
  getSingleUser(req.params.id).then((result) => {
    if (result.rows.length === 0) {
      return res
        .status(400)
        .send(
          `The user with the id ${req.params.id} does not exist in the db.`
        );
    }
    const { firstname, lastname } = req.body;
    db.query("UPDATE users SET firstname=$1, lastname=$2 RETURNING *", [
      firstname,
      lastname,
    ])
      .then((result) => {
        res.send(result.rows[0]);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Failed to update the user.");
      });
  });
});

module.exports = router;
