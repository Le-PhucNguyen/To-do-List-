function updateTodo(id, updatedData) {
    fetch(`http://localhost:5000/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((data) => console.log('Todo updated:', data))
      .catch((error) => console.error('Error updating todo:', error));
  }
  