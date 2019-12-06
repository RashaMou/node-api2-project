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

router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      res.status(500).json("Error retrieving post");
    });
});

router.delete("/:id", (req, res) => {
  Posts.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(201).json(`${count} posts have been deleted`);
      } else {
        res.status(404).json("The post could not be found");
      }
    })
    .catch(error => {
      res.status(500).json("Error deleting post");
    });
});

module.exports = router;
