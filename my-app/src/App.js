import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [posts, setPosts] = useState([]); 
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedPost, setEditedPost] = useState({ title: "", description: "" }); 
  const [newPost, setNewPost] = useState({ title: "", description: "" });

  useEffect(() => {
    axios
      .get("https://back-olive.glitch.me/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  const handleAddPost = () => {
    const newPostData = { title: newPost.title, description: newPost.description };
    axios.post("https://back-olive.glitch.me/posts/new", newPostData)
      .then((res) => {
        setPosts([...posts, res.data]); 
        setNewPost({ title: "", description: "" }); 
      })
      .catch((err) => console.error("Error adding post:", err));
  };


  
  const handleEditPost = (post) => {
    setEditingPostId(post._id); 
    setEditedPost({ title: post.title, description: post.description }); 
  };

  const handleUpdatePost = (id) => {
    if (!editedPost.title.trim() || !editedPost.description.trim()) {
      alert("Title and description cannot be empty."); 
      return;
    }

    axios
      .put(`https://back-olive.glitch.me/posts/${id}`, editedPost)
      .then((res) => {
        setPosts(
          posts.map((post) => (post._id === id ? res.data : post)) 
        );
        setEditingPostId(null);
      })
      .catch((err) => console.error("Error updating post:", err));
  };

  const handleDeletePost = (id) => {
    axios
      .delete(`https://back-olive.glitch.me/posts/${id}`)
      .then(() => setPosts(posts.filter((post) => post._id !== id)))
      .catch((err) => console.error("Error deleting post:", err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewPostChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value })); 
  };

  return (
    <div>
      <h1>To-Do List</h1>
       <div>
        <a href="https://back-olive.glitch.me/posts" target="_blank" rel="noopener noreferrer">
          View All Posts
        </a>
        <br />
        <a href="https://back-olive.glitch.me/posts/new" target="_blank" rel="noopener noreferrer">
          Create Post
        </a>
        <br />
        <a href="https://back-olive.glitch.me/posts/:id" target="_blank" rel="noopener noreferrer">
          Edit Post
        </a>
        <br />
        <a href="https://back-olive.glitch.me/posts/:id" target="_blank" rel="noopener noreferrer">
          Delete Post
        </a>
      </div>
    
      {/* Input form for new posts */}
      <div>
        <input
          type="text"
          name="title"
          value={newPost.title}
          onChange={handleNewPostChange}
          placeholder="New Post Title"
        />
        <textarea
          name="description"
          value={newPost.description}
          onChange={handleNewPostChange}
          placeholder="New Post Description"
        />
        <button onClick={handleAddPost}>Add Post</button>
      </div>

      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            {editingPostId === post._id ? (
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
    </div>
  );
};

export default App;