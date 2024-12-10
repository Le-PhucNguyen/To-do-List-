function deleteTodo(id) {
    axios.delete(`http://localhost:5000/api/todos/${id}`)
      .then(() => console.log('Todo deleted'))
      .catch((error) => console.error('Error deleting todo:', error));
  }

  