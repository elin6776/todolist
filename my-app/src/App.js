import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [posts, setPosts] = useState([]); // State to hold posts
  const [editingPostId, setEditingPostId] = useState(null); // ID of the post being edited
  const [editedPost, setEditedPost] = useState({ title: "", description: "" }); // Data for the post being edited

  useEffect(() => {
    // Fetch posts from the server when the component mounts
    axios
      .get("http://localhost:5000/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  const handleAddPost = () => {
    const newPost = { title: "New Post", description: "New Description" }; // Default new post
    axios
      .post("http://localhost:5000/posts", newPost)
      .then((res) => setPosts([...posts, res.data])) // Append the new post to the state
      .catch((err) => console.error("Error adding post:", err));
  };

  const handleEditPost = (post) => {
    setEditingPostId(post._id); // Set the ID of the post being edited
    setEditedPost({ title: post.title, description: post.description }); // Pre-fill the edit fields with existing post data
  };

  const handleUpdatePost = (id) => {
    if (!editedPost.title.trim() || !editedPost.description.trim()) {
      alert("Title and description cannot be empty."); // Prevent empty updates
      return;
    }

    axios
      .put(`http://localhost:5000/posts/${id}`, editedPost)
      .then((res) => {
        setPosts(
          posts.map((post) => (post._id === id ? res.data : post)) // Update the post in the state
        );
        setEditingPostId(null); // Exit edit mode
      })
      .catch((err) => console.error("Error updating post:", err));
  };

  const handleDeletePost = (id) => {
    axios
      .delete(`http://localhost:5000/posts/${id}`)
      .then(() => setPosts(posts.filter((post) => post._id !== id))) // Remove the deleted post from the state
      .catch((err) => console.error("Error deleting post:", err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPost((prev) => ({ ...prev, [name]: value })); // Update the editedPost state with user input
  };

  return (
    <div>
      <h1>To-Do List</h1>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            {editingPostId === post._id ? (
              // Render editable inputs if this post is being edited
              <>
                <input
                  type="text"
                  name="title"
                  value={editedPost.title}
                  onChange={handleChange}
                  placeholder="Edit title"
                />
                <textarea
                  name="description"
                  value={editedPost.description}
                  onChange={handleChange}
                  placeholder="Edit description"
                />
                <button onClick={() => handleUpdatePost(post._id)}>Save</button>
                <button onClick={() => setEditingPostId(null)}>Cancel</button>
              </>
            ) : (
              // Render the post details if not in edit mode
              <>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                <p>
                  Status: {post.isCompleted ? "Completed" : "Not Completed"}
                </p>
                <button onClick={() => handleEditPost(post)}>Edit</button>
                <button onClick={() => handleDeletePost(post._id)}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <button onClick={handleAddPost}>Add Post</button>
    </div>
  );
};

export default App;



