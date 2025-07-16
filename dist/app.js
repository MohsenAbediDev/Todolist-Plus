"use strict";
const taskInput = document.querySelector('#task-input');
const addTaskBtn = document.querySelector('#add-task');
const progressBar = document.querySelector('#progress-bar');
const tasksContainer = document.querySelector('#task-list');
const footer = document.querySelector('#footer');
const noTaskMessage = document.querySelector('#noTask-message');
const notyf = new Notyf({
    position: {
        x: 'right',
        y: 'top',
    },
});
const storedTodos = localStorage.getItem('todos');
const todos = storedTodos ? JSON.parse(storedTodos) : [];
const addTaskHandler = () => {
    const value = taskInput.value.trim();
    const isDuplicate = todos.some((todo) => todo.title.trim().toLowerCase() === value.toLowerCase());
    if (isDuplicate) {
        notyf.error('This task exists !');
        return;
    }
    if (value) {
        const newTodo = {
            id: todos.length + 1,
            title: value,
            isCompleted: false,
        };
        todos.push(newTodo);
        localStorage.setItem('todos', JSON.stringify(todos));
        showAnimation();
        todoGenerator(newTodo);
        taskInput.value = '';
    }
};
const showTodos = () => {
    if (todos.length > 0) {
        showAnimation();
        todos.forEach((todo) => {
            todoGenerator(todo);
        });
    }
};
const todoGenerator = (todo) => {
    tasksContainer.insertAdjacentHTML('beforeend', `
			<div
				class="task-item p-4 rounded-lg shadow-md transition-all duration-300 fade-in bg-white">
				<div class="flex items-center gap-3">
						<input type="checkbox" id="task-${todo.id}" name="task-${todo.id}" class="checkbox-custom cursor-pointer" />

						<label for="task-${todo.id}" class="flex-1 cursor-pointer transition-all duration-300 text-gray-800 hover:text-blue-500">
							${todo.title}
						</label>

					<div class="flex items-center gap-2 transition-opacity duration-200">
						<button
							class="rounded-sm whitespace-nowrap cursor-pointer px-3 py-2 bg-red-400 text-white hover:bg-red-500 transition-colors duration-200">
							<i class="fas fa-trash text-white"></i>
						</button>
					</div>
				</div>
			</div>`);
};
const showAnimation = () => {
    tasksContainer.classList.add('fade-in');
    tasksContainer.classList.remove('hidden');
    noTaskMessage.classList.add('hidden');
    footer.classList.add('fade-in');
    footer.classList.remove('hidden');
};
addTaskBtn === null || addTaskBtn === void 0 ? void 0 : addTaskBtn.addEventListener('click', () => {
    addTaskHandler();
});
taskInput === null || taskInput === void 0 ? void 0 : taskInput.addEventListener('keydown', (e) => e.key === 'Enter' ? addTaskHandler() : '');
window.addEventListener('load', showTodos);
