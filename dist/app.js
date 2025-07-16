"use strict";
const taskInput = document.querySelector('#task-input');
const addTask = document.querySelector('#add-task');
addTask === null || addTask === void 0 ? void 0 : addTask.addEventListener('click', () => {
    taskInput.value = '';
});
