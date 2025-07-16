const taskInput = document.querySelector('#task-input') as HTMLInputElement
const addTask = document.querySelector('#add-task') as HTMLButtonElement

addTask?.addEventListener('click', () => {
	taskInput.value = ''
})
