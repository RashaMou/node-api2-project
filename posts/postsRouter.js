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
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
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

router.get("/:id/comments", (req, res) => {
  Posts.findPostComments(req.params.id)
    .then(comments => {
      res.status(200).json(comments);
    })
    .catch(error => {
      res.status(500).json("Error retrieving comments");
    });
});

router.post("/:id/comments", async (req, res) => {
  const text = await req.body;
  const count = await res;
  console.log(res);
  try {
    if (count == 0) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
    if (!text) {
      res.status(400).json({
        errorMessage: "Please provide text for the comment."
      });
    } else Posts.insert(text);
    res.status(201).json(text);
  } catch (error) {
    res.status(500).json("Error adding post");
  }
});

router.delete("/:id", async (req, res) => {
  const post = await Posts.findById(req.params.id);
  const count = await Posts.remove(req.params.id);
  try {
    if (count > 0) {
      res.status(201).json({ message: "Removed post:", post });
    } else res.status(404).json({ message: "The post could not be found" });
  } catch (error) {
    res.status(500).json("Error deleting post");
  }
});

router.put("/:id", async (req, res) => {
  const { title, contents } = req.body;

  if (!title || !contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }

  const count = await Posts.update(req.params.id, req.body);
  console.log(count);
  try {
    if (count == 1) {
      const updatedPost = await Posts.findById(req.params.id);
      res
        .status(201)
        .json({ message: "Post updated successfully", updatedPost });
    } else {
      res
        .status(500)
        .json({ message: "The post with the specified ID does not exist." });
    }
  } catch {
    res
      .status(500)
      .json({ message: "The post information could not be modified." });
  }
});

module.exports = router;
