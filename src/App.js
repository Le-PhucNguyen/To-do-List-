import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import React, { useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]); // Ensure todos is initialized as an empty array
  const [search, setSearch] = useState('');
  const [completed, setCompleted] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // Number of items per page
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 5 });
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth'); // Redirect to login if no token is found
    }
  }, [navigate]);

  // Use useCallback to memoize fetchTodos
  const fetchTodos = useCallback(() => {
    const token = localStorage.getItem('token');

    // Define query explicitly
    const query = new URLSearchParams({
      search: search || '',      // Default to an empty string if undefined
      completed: completed || '', // Default to an empty string if undefined
      page: page || 1,           // Default to 1 if undefined
      limit: limit || 5,         // Default to 5 if undefined
    });

    fetch(`http://localhost:5000/api/todos?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token
      },
    })
      .then(response => response.json())
      .then(data => {
        setTodos(data.todos || []); // Ensure todos is always an array
        setPagination(data.pagination || { total: 0, page: 1, limit: 5 });
      })
      .catch(error => console.error('Error fetching todos:', error));
  }, [search, completed, page, limit]); // Include dependencies for useCallback

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]); // Include fetchTodos in the dependency array

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when search changes
  };

  const handleFilter = (e) => {
    setCompleted(e.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleAddTodo = (title) => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title }),
    })
      .then(() => fetchTodos())
      .catch(error => console.error('Error adding todo:', error));
  };

  const handleMarkComplete = (id) => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5000/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ completed: true }),
    })
      .then(() => fetchTodos())
      .catch(error => console.error('Error marking todo complete:', error));
  };

  const handleDeleteTodo = (id) => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5000/api/todos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => fetchTodos())
      .catch(error => console.error('Error deleting todo:', error));
  };

  return (
    <div className="App">
      <h1>Todo List</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search todos"
        value={search}
        onChange={handleSearch}
      />

      {/* Filter Dropdown */}
      <select value={completed} onChange={handleFilter}>
        <option value="">All</option>
        <option value="true">Completed</option>
        <option value="false">Not Completed</option>
      </select>

      {/* Todo List */}
      <ul>
        {todos.length === 0 ? (
          <li>No todos available</li>
        ) : (
          todos.map(todo => (
            <li key={todo._id}>
              {todo.title} {todo.completed ? '(Completed)' : ''}
              <button onClick={() => handleMarkComplete(todo._id)}>Mark Complete</button>
              <button onClick={() => handleDeleteTodo(todo._id)}>Delete</button>
            </li>
          ))
        )}
      </ul>

      {/* Pagination Controls */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }).map((_, idx) => (
          <button
            key={idx}
            className={pagination.page === idx + 1 ? 'active' : ''}
            onClick={() => handlePageChange(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Add a new todo"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleAddTodo(e.target.value);
            e.target.value = ''; // Clear the input after adding
          }
        }}
      />
    </div>
  );
}

export default App;
