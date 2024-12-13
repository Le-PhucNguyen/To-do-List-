const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); // For JWT
const bcrypt = require('bcryptjs');
const authMiddleware = require('./middleware/auth'); // Middleware for protecting routes

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/todos';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define Schema and Model
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Todo = mongoose.model('Todo', todoSchema);

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

const SECRET_KEY = 'your_secret_key';

// Routes
// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

// Protected Todo Routes
app.get('/api/todos', authMiddleware, async (req, res) => {
  try {
    const { search, completed, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};
    if (search) {
      filter.title = { $regex: search, $options: 'i' }; // Case-insensitive search
    }
    if (completed !== undefined) {
      filter.completed = completed === 'true'; // Convert completed to boolean
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Query database
    const todos = await Todo.find(filter).skip(skip).limit(parseInt(limit));
    const total = await Todo.countDocuments(filter); // Total count of filtered todos

    res.json({
      todos,
      pagination: {
        total, // Total todos matching the filter
        page: parseInt(page), // Current page
        limit: parseInt(limit), // Items per page
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching todos' });
  }
});

app.post('/api/todos', authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    const newTodo = new Todo({ title });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ message: 'Error adding todo' });
  }
});

app.put('/api/todos/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (title !== undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;

    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Error updating todo' });
  }
});

app.delete('/api/todos/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Error deleting todo' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
