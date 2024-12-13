import React, { useEffect, useState, useCallback } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]); // Initialize todos
  const [search, setSearch] = useState('');
  const [completed, setCompleted] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // Number of items per page
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 5 });
  const [errorMessage, setErrorMessage] = useState(''); // For error messages

  const fetchTodos = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const query = new URLSearchParams({
        search,
        completed,
        page,
        limit,
      }).toString();

      const response = await fetch(`http://localhost:5000/api/todos?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }

      const data = await response.json();
      setTodos(data.todos || []);
      setPagination(data.pagination || { total: 0, page: 1, limit: 5 });
    } catch (error) {
      console.error('Error fetching todos:', error);
      setErrorMessage('Failed to fetch todos. Please try again.');
    }
  }, [search, completed, page, limit]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAddTodo = async (title) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error('Failed to add todo');
      }

      await fetchTodos();
    } catch (error) {
      console.error('Error adding todo:', error);
      setErrorMessage('Failed to add todo. Please try again.');
    }
  };

  const handleMarkComplete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ completed: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark todo as complete');
      }

      await fetchTodos();
    } catch (error) {
      console.error('Error marking todo complete:', error);
      setErrorMessage('Failed to update todo. Please try again.');
    }
  };

  const handleDeleteTodo = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      await fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
      setErrorMessage('Failed to delete todo. Please try again.');
    }
  };

  return (
    <div className="App">
      <h1>Todo List</h1>

      {errorMessage && <p className="error">{errorMessage}</p>}

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search todos"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* Filter Dropdown */}
      <select
        value={completed}
        onChange={(e) => {
          setCompleted(e.target.value);
          setPage(1);
        }}
      >
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
            onClick={() => setPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Add Todo Input */}
      <input
        type="text"
        placeholder="Add a new todo"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleAddTodo(e.target.value);
            e.target.value = ''; // Clear input after adding
          }
        }}
      />
    </div>
  );
}

export default App;
