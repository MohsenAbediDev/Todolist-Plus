const taskInput = document.querySelector('#task-input') as HTMLInputElement
const addTaskBtn = document.querySelector('#add-task') as HTMLButtonElement
const progressBar = document.querySelector('#progress-bar') as HTMLDivElement
const tasksContainer = document.querySelector('#task-list') as HTMLDivElement

const noTaskMessage = document.querySelector(
	'#noTask-message'
) as HTMLDivElement

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
		const newTodo = {
			id: tasksList.length + 1,
			title: value,
			isCompleted: false,
		}
		tasksList.push(newTodo)

		tasksContainer.classList.add('fade-in')
		tasksContainer.classList.remove('hidden')

		noTaskMessage.classList.add('hidden')

		tasksContainer.insertAdjacentHTML(
			'beforeend',
			`
			<div
				class="task-item p-4 rounded-lg shadow-md transition-all duration-300 fade-in bg-white">
				<div class="flex items-center gap-3">
						<input type="checkbox" name="task-${newTodo.id}" class="checkbox-custom cursor-pointer" />

						<span
							class="flex-1 cursor-pointer transition-all duration-300 text-gray-800 hover:text-blue-500">
							${newTodo.title}
						</span>

					<div class="flex items-center gap-2 transition-opacity duration-200">
						<button
							class="rounded-sm whitespace-nowrap cursor-pointer px-3 py-2 bg-green-500 hover:bg-green-600 transition-colors duration-200">
							<i class="fas fa-check text-white"></i>
						</button>

						<button
							class="rounded-sm whitespace-nowrap cursor-pointer px-3 py-2 bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-200">
							<i class="fas fa-xmark text-white"></i>
						</button>
					</div>
				</div>
			</div>`
		)
	}

	console.log(tasksList)

	taskInput.value = ''
}
