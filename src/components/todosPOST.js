import axios from 'axios';
import { useState } from 'react';

function AddTodo() {
  const [title, setTitle] = useState('');

  const handleAddTodo = () => {
    axios.post('http://localhost:5000/api/todos', { title })
      .then((response) => {
        console.log('Todo added:', response.data);
      })
      .catch((error) => console.error('Error adding todo:', error));
  };

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter new todo"
      />
      <button onClick={handleAddTodo}>Add Todo</button>
    </div>
  );
}

export default AddTodo;
