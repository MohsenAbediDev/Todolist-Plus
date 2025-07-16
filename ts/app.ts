const taskInput = document.querySelector('#task-input') as HTMLInputElement
const addTaskBtn = document.querySelector('#add-task') as HTMLButtonElement
const progressBar = document.querySelector('#progress-bar') as HTMLDivElement

interface Task {
	id: number
	title: string
	isCompleted: boolean
}

const tasksList: Task[] = []

addTaskBtn?.addEventListener('click', () => {
	addTaskHandler()
})
taskInput?.addEventListener('keydown', (e) =>
	e.key === 'Enter' ? addTaskHandler() : ''
)

const addTaskHandler = () => {
	const value = taskInput.value.trim()

	if (value) {
		tasksList.push({
			id: tasksList.length + 1,
			title: value,
			isCompleted: false,
		})
	}

	console.log(tasksList)

	taskInput.value = ''
}
