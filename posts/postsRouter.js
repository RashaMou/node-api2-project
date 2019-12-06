const express = require("express");

const Posts = require("../data/db");

const router = express.Router();

router.use(express.json());

router.get("/", (req, res) => {
  Posts.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res.status(500).json("Error retrieving posts");
    });
});

router.post("/", (req, res) => {
  Posts.insert(req.body)
    .then(post => {
      res.status(201).json({ ...post, ...req.body });
    })
    .catch(error => {
      res.status(500).json("Error adding post");
    });
});

module.exports = router;
