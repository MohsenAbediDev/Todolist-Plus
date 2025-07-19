// @ts-ignore
import { todos, Task, notyf } from '../dist/app.js'

const intervals: Record<number, ReturnType<typeof setInterval>> = {}

function saveTodosToStorage(todos: Task[]) {
	localStorage.setItem('todos', JSON.stringify(todos))
}

// Format timer style
function formatTime(seconds: number): string {
	const hrs = Math.floor(seconds / 3600)
		.toString()
		.padStart(2, '0')
	const mins = Math.floor((seconds % 3600) / 60)
		.toString()
		.padStart(2, '0')
	const secs = (seconds % 60).toString().padStart(2, '0')
	return `${hrs}:${mins}:${secs}`
}

;(window as any).startTimer = function (e: Event, id: number): void {
	const timperSpan = document.querySelector(`#timer-${id}`) as HTMLSpanElement
	const taskIndex = todos.findIndex((todo: Task) => todo.id === id)

	if (taskIndex === -1) {
		notyf.error(`Task with id ${id} not found.`)
		return
	}

	const task = todos[taskIndex]

	// If it's running, stop it.
	if (task.timer.isRunning) {
		clearInterval(intervals[id])
		delete intervals[id]

		task.timer.isRunning = false
		saveTodosToStorage(todos)

		toggleTimer(e, task)
		return
	}

	// If it was stopped, run it.
	task.timer.isRunning = true
	saveTodosToStorage(todos)

	intervals[id] = setInterval(() => {
		task.timer.elapsedTime += 1
		timperSpan.innerHTML = formatTime(task.timer.elapsedTime)
		saveTodosToStorage(todos)
	}, 1000)

	toggleTimer(e, task)
}
// Change button style
const toggleTimer = (e: Event, task: Task) => {
	const target = e.target as HTMLButtonElement

	if (task.timer.isRunning === true) {
		target.innerHTML = 'Stop'
		target.classList.replace('start-timer', 'stop-timer')
	} else {
		target.innerHTML = 'Start'
		target.classList.replace('stop-timer', 'start-timer')
	}
}

export const showTimer = () => {
	todos.forEach((task: Task) => {
		const timerSpan = document.querySelector(`#timer-${task.id}`) as HTMLSpanElement /* prettier-ignore */
		if (!timerSpan) {
			notyf.error(`Timer element for task ${task.id} not found.`)
			return
		}
		timerSpan.textContent = formatTime(task.timer.elapsedTime)
	})
}
