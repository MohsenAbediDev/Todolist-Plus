"use strict";
const taskInput = document.querySelector('#task-input');
const addTaskBtn = document.querySelector('#add-task');
const progressBar = document.querySelector('#progress-bar');
const tasksList = [];
addTaskBtn === null || addTaskBtn === void 0 ? void 0 : addTaskBtn.addEventListener('click', () => {
    addTaskHandler();
});
taskInput === null || taskInput === void 0 ? void 0 : taskInput.addEventListener('keydown', (e) => e.key === 'Enter' ? addTaskHandler() : '');
const addTaskHandler = () => {
    const value = taskInput.value.trim();
    if (value) {
        tasksList.push({
            id: tasksList.length + 1,
            title: value,
            isCompleted: false,
        });
    }
    console.log(tasksList);
    taskInput.value = '';
};
