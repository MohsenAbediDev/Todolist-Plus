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
						<input type="checkbox" 
							name="task-${todo.id}" 
							onchange="completeTask(event, ${todo.id})" 
							class="checkbox-custom cursor-pointer" 
							${todo.isCompleted ? 'checked' : ''} />

						<span 
							class="flex-1 ${todo.isCompleted ? 'line-through opacity-50' : ''} cursor-pointer transition-all duration-300 text-gray-800 hover:text-blue-500">
							${todo.title}
						</span>

					<div class="flex items-center gap-2 transition-opacity duration-200">
						<button 
							onclick="removeTask(${todo.id})"
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
    if (todos.length > 0) {
        footer.classList.add('fade-in');
        footer.classList.remove('hidden');
    }
    else {
        footer.classList.add('hidden');
        footer.classList.remove('fade-in');
        noTaskMessage.classList.remove('hidden');
    }
};
window.removeTask = function (id) {
    const filteredTodos = todos.filter((task) => task.id !== id);
    todos.length = 0;
    todos.push(...filteredTodos);
    localStorage.setItem('todos', JSON.stringify(todos));
    const taskItems = tasksContainer.querySelectorAll('.task-item');
    taskItems.forEach((item) => item.remove());
    showAnimation();
    showTodos();
    notyf.success('Task has been deleted !');
};
window.completeTask = function (e, id) {
    const checkbox = e.target;
    const isTaskCompleted = checkbox.checked;
    const updatedTodos = todos.map((task) => {
        if (task.id === id) {
            return Object.assign(Object.assign({}, task), { isCompleted: isTaskCompleted });
        }
        return task;
    });
    todos.length = 0;
    todos.push(...updatedTodos);
    localStorage.setItem('todos', JSON.stringify(todos));
    const taskItems = tasksContainer.querySelectorAll('.task-item');
    taskItems.forEach((item) => item.remove());
    showAnimation();
    showTodos();
};
addTaskBtn === null || addTaskBtn === void 0 ? void 0 : addTaskBtn.addEventListener('click', () => {
    addTaskHandler();
});
taskInput === null || taskInput === void 0 ? void 0 : taskInput.addEventListener('keydown', (e) => e.key === 'Enter' ? addTaskHandler() : '');
window.addEventListener('load', showTodos);
