const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3300;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000" }));

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
  });

// Define a schema for the post
const postSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// Create a model based on the schema
const Post = mongoose.model("Post", postSchema);

const posts = [
  { id: 1, title: 'Post 1', content: 'This is the content of post 1' },
  { id: 2, title: 'Post 2', content: 'This is the content of post 2' },
  { id: 3, title: 'Post 3', content: 'This is the content of post 3' }
];

// Define a route for creating a new post
app.post("/api/posts", async (req, res) => {
  const { email, password } = req.body;
  // Create a new post object
  const newPost = new Post({ email, password });

  try {
    // Save the post to the database
    await newPost.save();
    res.status(201).json({ message: "Post created successfully" });
  } catch (err) {
    console.error("Failed to save the post", err);
    res.status(500).json({ error: "Failed to save the post" });
  }
});

app.get('/api/test', (req, res) => {
  res.json(posts);
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
