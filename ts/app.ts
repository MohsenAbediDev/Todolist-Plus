const taskInput = document.querySelector('#task-input') as HTMLInputElement
const addTaskBtn = document.querySelector('#add-task') as HTMLButtonElement
const progressBar = document.querySelector('#progress-bar') as HTMLDivElement
const tasksContainer = document.querySelector('#task-list') as HTMLDivElement
const footer = document.querySelector('#footer') as HTMLDivElement
const noTaskMessage = document.querySelector(
	'#noTask-message'
) as HTMLDivElement

interface Task {
	id: number
	title: string
	isCompleted: boolean
}

const notyf = new Notyf({
	position: {
		x: 'right',
		y: 'top',
	},
})

const storedTodos = localStorage.getItem('todos')
const todos: Task[] = storedTodos ? JSON.parse(storedTodos) : []

const addTaskHandler = () => {
	const value = taskInput.value.trim()
	const isDuplicate = todos.some(
		(todo) => todo.title.trim().toLowerCase() === value.toLowerCase()
	)

	if (isDuplicate) {
		notyf.error('This task exists !')

		return
	}

	if (value) {
		const newTodo = {
			id: todos.length + 1,
			title: value,
			isCompleted: false,
		}
		todos.push(newTodo)
		localStorage.setItem('todos', JSON.stringify(todos))

		showAnimation()

		todoGenerator(newTodo)

		taskInput.value = ''
	}
}

const showTodos = () => {
	if (todos.length > 0) {
		showAnimation()

		todos.forEach((todo) => {
			todoGenerator(todo)
		})
	}
}

const todoGenerator = (todo: Task) => {
	tasksContainer.insertAdjacentHTML(
		'beforeend',
		`
			<div
				class="task-item p-4 rounded-lg shadow-md transition-all duration-300 fade-in bg-white">
				<div class="flex items-center gap-3">
						<input type="checkbox" id="task-${todo.id}" name="task-${todo.id}" class="checkbox-custom cursor-pointer" />

						<label for="task-${todo.id}" class="flex-1 cursor-pointer transition-all duration-300 text-gray-800 hover:text-blue-500">
							${todo.title}
						</label>

					<div class="flex items-center gap-2 transition-opacity duration-200">
						<button 
							onclick="removeTask(${todo.id})"
							class="rounded-sm whitespace-nowrap cursor-pointer px-3 py-2 bg-red-400 text-white hover:bg-red-500 transition-colors duration-200">
							<i class="fas fa-trash text-white"></i>
						</button>
					</div>
				</div>
			</div>`
	)
}

const showAnimation = () => {
	tasksContainer.classList.add('fade-in')
	tasksContainer.classList.remove('hidden')

	noTaskMessage.classList.add('hidden')

	console.log(todos.length)

	if (todos.length > 0) {
		footer.classList.add('fade-in')
		footer.classList.remove('hidden')
	} else {
		footer.classList.add('hidden')
		footer.classList.remove('fade-in')

		noTaskMessage.classList.remove('hidden')
	}
}

;(window as any).removeTask = function (id: number) {
	const filteredTodos: Task[] = todos.filter((task) => task.id !== id)

	todos.length = 0
	todos.push(...filteredTodos)

	localStorage.setItem('todos', JSON.stringify(todos))

	const taskItems = tasksContainer.querySelectorAll('.task-item')
	taskItems.forEach((item) => item.remove())

	showAnimation()
	showTodos()

	notyf.success('Task has been deleted !')
}

addTaskBtn?.addEventListener('click', () => {
	addTaskHandler()
})
taskInput?.addEventListener('keydown', (e) =>
	e.key === 'Enter' ? addTaskHandler() : ''
)

window.addEventListener('load', showTodos)
