// script.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const todoList = document.getElementById('todo-list');

    // Load existing todos from local storage
    const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    savedTodos.forEach(todo => addTodoToList(todo));

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskInput = document.getElementById('task');
        const task = taskInput.value;

        const todo = { id: Date.now(), task };
        addTodoToList(todo);

        // Save to local storage
        savedTodos.push(todo);
        localStorage.setItem('todos', JSON.stringify(savedTodos));

        taskInput.value = '';
    });

    // Add a todo to the list
    function addTodoToList(todo) {
        const li = document.createElement('li');
        li.textContent = todo.task;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            li.remove();
            // Update local storage
            const index = savedTodos.findIndex(t => t.id === todo.id);
            savedTodos.splice(index, 1);
            localStorage.setItem('todos', JSON.stringify(savedTodos));
        });

        li.appendChild(deleteButton);
        todoList.appendChild(li);
    }
});
