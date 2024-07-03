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
                const timestamp = new Date().toLocaleString();

                let reminderTime = null;
                const reminderMinutes = prompt('Set reminder (in minutes):');
                if (reminderMinutes) {
                    reminderTime = new Date(Date.now() + parseInt(reminderMinutes) * 60000);
                }

                const todo = { id: Date.now(), task, reminderTime, timestamp };
                addTodoToList(todo);

                // Save to local storage
                savedTodos.push(todo);
                localStorage.setItem('todos', JSON.stringify(savedTodos));

                taskInput.value = '';
            });

            // Add a todo to the list
            function addTodoToList(todo) {
                const li = document.createElement('li');
                li.setAttribute('draggable', true);
                li.dataset.id = todo.id;
                li.innerHTML = `
                    <span>${todo.task} 
                        <small style="font-size: 0.4em; color: #888;">
                            (Added: ${todo.timestamp})
                        </small>
                    </span>
                    <button>Delete</button>
                `;

                // Reminder functionality
                if (todo.reminderTime) {
                    const reminderTime = new Date(todo.reminderTime).getTime();
                    const now = new Date().getTime();
                    const timeUntilReminder = reminderTime - now;

                    if (timeUntilReminder > 0) {
                        setTimeout(() => {
                            const isCompleted = confirm(`Reminder: ${todo.task}\nDid you complete this task?\n\nPress OK for Yes, Cancel for No.`);
                            if (isCompleted) {
                                li.remove();
                                // Update local storage
                                const index = savedTodos.findIndex(t => t.id === todo.id);
                                savedTodos.splice(index, 1);
                                localStorage.setItem('todos', JSON.stringify(savedTodos));
                            }
                        }, timeUntilReminder);
                    }
                }

                li.querySelector('button').addEventListener('click', () => {
                    li.remove();
                    // Update local storage
                    const index = savedTodos.findIndex(t => t.id === todo.id);
                    savedTodos.splice(index, 1);
                    localStorage.setItem('todos', JSON.stringify(savedTodos));
                });

                todoList.appendChild(li);
            }

            // Initialize SortableJS
            Sortable.create(todoList, {
                animation: 150,
                onEnd: () => {
                    const updatedOrder = [];
                    todoList.querySelectorAll('li').forEach(item => {
                        const id = parseInt(item.dataset.id, 10);
                        const todo = savedTodos.find(t => t.id === id);
                        if (todo) {
                            updatedOrder.push(todo);
                        }
                    });
                    localStorage.setItem('todos', JSON.stringify(updatedOrder));
                    savedTodos.length = 0;
                    Array.prototype.push.apply(savedTodos, updatedOrder);
                }
            });
        });
