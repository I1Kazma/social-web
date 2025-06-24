const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const mongoose = require("mongoose");

//create a post

router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});
//update a post

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//delete a post

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//like / dislike a post

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//get a post

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get timeline posts

router.get("/timeline/:userId", async (req, res) => {
  try {
    const userId = req.params.userId; // Extract userId from URL path
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }
    // Check if followings exists and is an array
    const followings = Array.isArray(currentUser.followings)
      ? currentUser.followings
      : [];
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    console.error("Error in /timeline/:userId:", err.message, err.stack);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
});

//get user's posts
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error in /profile/:userId:", err.message, err.stack);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
});

module.exports = router;
