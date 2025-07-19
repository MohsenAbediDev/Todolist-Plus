// @ts-ignore
import { todos, notyf } from '../dist/app.js';
const intervals = {};
function saveTodosToStorage(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}
// Format timer style
function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600)
        .toString()
        .padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60)
        .toString()
        .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
}
;
window.startTimer = function (e, id) {
    const timperSpan = document.querySelector(`#timer-${id}`);
    const taskIndex = todos.findIndex((todo) => todo.id === id);
    if (taskIndex === -1) {
        notyf.error(`Task with id ${id} not found.`);
        return;
    }
    const task = todos[taskIndex];
    // If it's running, stop it.
    if (task.timer.isRunning) {
        clearInterval(intervals[id]);
        delete intervals[id];
        task.timer.isRunning = false;
        saveTodosToStorage(todos);
        toggleTimer(e, task);
        return;
    }
    // If it was stopped, run it.
    task.timer.isRunning = true;
    saveTodosToStorage(todos);
    intervals[id] = setInterval(() => {
        task.timer.elapsedTime += 1;
        timperSpan.innerHTML = formatTime(task.timer.elapsedTime);
        saveTodosToStorage(todos);
    }, 1000);
    toggleTimer(e, task);
};
// Change button style
const toggleTimer = (e, task) => {
    const target = e.target;
    if (task.timer.isRunning === true) {
        target.innerHTML = 'Stop';
        target.classList.replace('start-timer', 'stop-timer');
    }
    else {
        target.innerHTML = 'Start';
        target.classList.replace('stop-timer', 'start-timer');
    }
};
export const showTimer = () => {
    todos.forEach((task) => {
        const timerSpan = document.querySelector(`#timer-${task.id}`); /* prettier-ignore */
        if (!timerSpan) {
            notyf.error(`Timer element for task ${task.id} not found.`);
            return;
        }
        timerSpan.textContent = formatTime(task.timer.elapsedTime);
    });
};
