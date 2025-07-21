// @ts-ignore
import { applyStoredTheme } from '../dist/theme.js';
// @ts-ignore
import { showTimer } from '../dist/timer.js';
const taskInput = document.querySelector('#task-input');
const addTaskBtn = document.querySelector('#add-task');
const filterBox = document.querySelector('#filter-box');
const tasksContainer = document.querySelector('#task-list');
const category = document.querySelector('#category');
const selectCategoryFilter = document.querySelector('#category-filter'); /* prettier-ignore */
const selectDifficultyFilter = document.querySelector('#difficulty-filter'); /* prettier-ignore */
const footer = document.querySelector('#footer');
const statTotal = document.querySelector('#stat-total');
const statCompleted = document.querySelector('#stat-completed');
const statRemaining = document.querySelector('#stat-remaining');
const closeBoxBtn = document.querySelector('#close-box');
const exportBtn = document.querySelector('#export-btn');
const sortDropdown = document.querySelector('#sort-dropdown');
const sortToggleBtn = document.querySelector('#sort-toggle-btn'); /* prettier-ignore */
const sortButtons = document.querySelectorAll('#sort-dropdown [data-sort]'); /* prettier-ignore */
const taskCharCount = document.querySelector('#task-char-count'); /* prettier-ignore */
const filterTotal = document.querySelector('#filter-total');
const filterCompleted = document.querySelector('#filter-completed'); /* prettier-ignore */
const filterRemaining = document.querySelector('#filter-remaining'); /* prettier-ignore */
const descriptionCharCount = document.querySelector('#description-char-count'); /* prettier-ignore */
const exportDropdown = document.querySelector('#exportDropdown'); /* prettier-ignore */
const inputContainer = document.querySelector('#input-container'); /* prettier-ignore */
const descriptionContainer = document.querySelector('#description-container'); /* prettier-ignore */
const descriptionInput = document.querySelector('#description-input'); /* prettier-ignore */
const selectContainer = document.querySelector('#select-container'); /* prettier-ignore */
const difficultyContainer = document.querySelector('#difficulty-container'); /* prettier-ignore */
const noTaskMessage = document.querySelector('#noTask-message'); /* prettier-ignore */
const difficultyLevels = document.querySelectorAll('#difficulty-levels button'); /* prettier-ignore */
export const notyf = new Notyf({
    position: {
        x: 'right',
        y: 'top',
    },
});
const storedTodos = localStorage.getItem('todos');
export let todos = storedTodos ? JSON.parse(storedTodos) : [];
let currentSortMode = '';
// Generate unique id fot tasks
function generateUniqueNumericId(todos) {
    const existingIds = new Set(todos.map((t) => t.id));
    let id;
    do {
        id = Math.floor(Math.random() * 1000000);
    } while (existingIds.has(id));
    return id;
}
const addTaskHandler = () => {
    // prettier-ignore
    const levelsSelected = document.querySelectorAll('#difficulty-levels button.text-yellow-400');
    const value = taskInput.value.trim();
    const isDuplicate = todos.some((todo) => todo.title.trim().toLowerCase() === value.toLowerCase());
    if (isDuplicate) {
        notyf.error('This task exists !');
        return;
    }
    if (value) {
        const newTodo = {
            id: generateUniqueNumericId(todos),
            title: value,
            description: descriptionInput.value,
            category: category.value,
            level: levelsSelected.length,
            timer: { elapsedTime: 0, isRunning: false },
            createdAt: new Date().toISOString(),
            isCompleted: false,
        };
        todos.push(newTodo);
        localStorage.setItem('todos', JSON.stringify(todos));
        showAnimation();
        updateFooterStat();
        resetStars();
        closeInputBox();
        todoGenerator(newTodo);
        taskInput.value = '';
        descriptionInput.value = '';
        taskCharCount.textContent = `0/50`;
        descriptionCharCount.textContent = `0/70`;
    }
    else
        notyf.error('Please Fill Task Title !');
};
const showTodos = () => {
    if (todos.length > 0) {
        showAnimation();
        updateFooterStat();
        todos.forEach((todo) => {
            todoGenerator(todo);
        });
    }
};
const todoGenerator = (todo) => {
    const isCompletedClass = todo.isCompleted ? 'line-through opacity-50' : '';
    // Create stars
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= todo.level) {
            starsHtml += `<span class="text-sm text-yellow-400"><i class="fas fa-star"></i></span>`;
        }
        else {
            starsHtml += `<span class="text-sm text-gray-300"><i class="fas fa-star"></i></span>`;
        }
    }
    tasksContainer.insertAdjacentHTML('beforeend', `
		<div class="task-item p-4 rounded-lg shadow-md transition-all duration-300 fade-in bg-white dark:bg-gray-700 overflow-hidden">
			<div class="flex items-center gap-3">
				<input type="checkbox" 
					name="task-${todo.id}" 
					onchange="completeTask(event, ${todo.id})" 
					class="checkbox-custom cursor-pointer" 
					${todo.isCompleted ? 'checked' : ''} />

				<div class="flex flex-1 flex-col gap-y-1">
					<span class="${`${isCompletedClass} cursor-pointer transition-all duration-300 text-gray-800 dark:text-gray-200 hover:text-blue-500`.trim()}"
							onclick="editTask(event, ${todo.id})">
							${todo.title}
					</span>


					<span class="self-start text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
						${todo.category}
					</span>
				</div>

				<div class="flex items-center gap-2 transition-opacity duration-200">
					<!-- Stars -->
					<div class="flex gap-1">
						${starsHtml}
					</div> 
				
					<!-- Timer --> 
					<div class="flex items-center flex-col-reverse sm:flex-row gap-2">
						<span id="timer-${todo.id}" class="text-md text-gray-500 dark:text-gray-300">00:00:00</span>
						<button
							onclick="startTimer(event, ${todo.id})"
							${todo.isCompleted ? 'disabled' : ''}
							class="rounded-sm whitespace-nowrap cursor-pointer outline-none px-3 py-2 start-timer text-white transition-colors duration-200">
							Start
						</button>
					</div>

					<!-- Delete Task -->
					<button 
						onclick="removeTask(${todo.id})"
						class="rounded-sm whitespace-nowrap cursor-pointer px-3 py-2 bg-red-400 dark:bg-red-700  text-white hover:bg-red-500 dark:hover:bg-red-800 transition-colors duration-200">
						<i class="fas fa-trash text-white"></i>
					</button>
				</div>
			</div>

			${todo.description.length > 0
        ? `
					<div class="relative flex flex-col mt-2.5 py-2"> 
						<i onclick="showDescription(event, ${todo.id})" class="fa-solid fa-caret-down absolute top-0 transition-all duration-400 cursor-pointer text-gray-600 dark:text-gray-300"></i>

						<div class="w-[96%] h-[1px] ml-5 bg-gray-300 dark:bg-gray-500"></div>

						<div id="desc-${todo.id}" class="flex items-center gap-1 mt-3 h-0 transition-all duration-300 overflow-hidden">
							<span class="text-sm text-gray-700 dark:text-gray-300">Description:</span>  
							<p class="text-sm text-gray-500 dark:text-gray-100">${todo.description}</p>
						</div>
					</div>`
        : ''}
		</div>`);
};
// Show or Hide element Based on the existence of a task
const showAnimation = () => {
    tasksContainer.classList.add('fade-in');
    tasksContainer.classList.remove('hidden');
    filterBox.classList.add('fade-in');
    filterBox.classList.remove('hidden');
    noTaskMessage.classList.add('hidden');
    if (todos.length > 0) {
        footer.classList.add('fade-in');
        footer.classList.remove('hidden');
    }
    else {
        footer.classList.add('hidden');
        footer.classList.remove('fade-in');
        filterBox.classList.add('hidden');
        filterBox.classList.remove('fade-in');
        noTaskMessage.classList.remove('hidden');
    }
};
// Show Empty Task Icon
const ShowEmptyTaskMessage = () => {
    noTaskMessage.classList.toggle('hidden');
    noTaskMessage.classList.toggle('show');
};
const updateFooterStat = () => {
    const isCompletedCount = todos.filter((todo) => todo.isCompleted === true);
    const remainingCount = todos.filter((todo) => todo.isCompleted === false);
    statTotal.innerHTML = todos.length.toString();
    statCompleted.innerHTML = isCompletedCount.length.toString() || '0';
    statRemaining.innerHTML = remainingCount.length.toString() || '0';
};
// Open input box
taskInput.addEventListener('focus', () => {
    inputContainer.classList.remove('h-[100px]');
    inputContainer.classList.add('h-[332px]');
    descriptionContainer.classList.remove('hidden');
    descriptionContainer.classList.add('show');
    selectContainer.classList.remove('hidden');
    selectContainer.classList.add('show');
    difficultyContainer.classList.remove('hidden');
    difficultyContainer.classList.add('show');
});
const closeInputBox = () => {
    inputContainer.classList.remove('h-[332px]');
    inputContainer.classList.add('h-[100px]');
    descriptionContainer.classList.remove('show');
    descriptionContainer.classList.add('hidden');
    selectContainer.classList.remove('show');
    selectContainer.classList.add('hidden');
    difficultyContainer.classList.remove('show');
    difficultyContainer.classList.add('hidden');
};
// Open Export DropDown Handler
const openDropDown = () => {
    const isCurrentlyHidden = exportDropdown.classList.contains('hidden');
    if (isCurrentlyHidden) {
        exportDropdown.classList.remove('hidden');
        exportDropdown.classList.add('show');
        document.addEventListener('click', handleOutsideExportClick);
    }
    else {
        closeDropDown();
    }
};
// Close Export DropDown Handler
export const closeDropDown = () => {
    exportDropdown.classList.add('hidden');
    exportDropdown.classList.remove('show');
    document.removeEventListener('click', handleOutsideExportClick);
};
const handleOutsideExportClick = (event) => {
    const target = event.target;
    if (!exportDropdown.contains(target) && !exportBtn.contains(target)) {
        closeDropDown();
    }
};
// Open Sort DropDown Handler
const openSortDropdown = () => {
    const isCurrentlyHidden = sortDropdown.classList.contains('hidden');
    if (isCurrentlyHidden) {
        sortDropdown.classList.remove('hidden');
        document.addEventListener('click', handleOutsideSortClick);
    }
    else {
        closeSortDropDown();
    }
};
// Close Sort DropDown Handler
export const closeSortDropDown = () => {
    sortDropdown.classList.add('hidden');
    document.removeEventListener('click', handleOutsideSortClick);
};
const handleOutsideSortClick = (event) => {
    const target = event.target;
    if (!sortDropdown.contains(target) && !sortToggleBtn.contains(target)) {
        closeSortDropDown();
    }
};
// Limit Char Count For Task input
const updateTaskInputCount = () => {
    const count = taskInput.value.length;
    const max = taskInput.maxLength;
    taskCharCount.textContent = `${count}/${max}`;
};
// Limit Char Count For Description input
const updateTextareaCount = () => {
    const count = descriptionInput.value.length;
    const max = descriptionInput.maxLength;
    descriptionCharCount.textContent = `${count}/${max}`;
};
// Function to filter todos by mode name
const filterTodosByMode = (mode, todos) => {
    switch (mode) {
        case 'completed':
            return todos.filter((todo) => todo.isCompleted);
        case 'remaining':
            return todos.filter((todo) => !todo.isCompleted);
        default:
            return todos;
    }
};
// Function to sort todos by sort mode
const sortTodos = (todos) => {
    switch (currentSortMode) {
        case 'difficulty-asc':
            return [...todos].sort((a, b) => a.level - b.level);
        case 'difficulty-desc':
            return [...todos].sort((a, b) => b.level - a.level);
        case 'date-asc':
            return [...todos].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        case 'date-desc':
            return [...todos].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        default:
            return todos;
    }
};
// Apply Filters and Sort to todos
const applyFilters = (e) => {
    var _a;
    const target = e.target;
    const allTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    let filteredTodos = [...allTodos];
    // 1. Status Filter (span)
    if (target instanceof HTMLSpanElement) {
        const filterMode = ((_a = target.textContent) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) || '';
        filteredTodos = filterTodosByMode(filterMode, allTodos);
        updateStatusUI(target);
        // Reset other filters
        if (selectCategoryFilter)
            selectCategoryFilter.value = '';
        if (selectDifficultyFilter)
            selectDifficultyFilter.value = '';
    }
    // 2. Category Filter (select)
    else if (target === selectCategoryFilter) {
        const selectedCategory = selectCategoryFilter === null || selectCategoryFilter === void 0 ? void 0 : selectCategoryFilter.value;
        if (selectedCategory) {
            filteredTodos = allTodos.filter((todo) => todo.category === selectedCategory);
        }
        // Reset other filters
        if (selectDifficultyFilter)
            selectDifficultyFilter.value = '';
        const statusSpans = ['filter-total', 'filter-completed', 'filter-remaining'];
        statusSpans.forEach((id) => {
            var _a;
            (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.classList.remove('primary-color');
        });
    }
    // 3. Difficulty Filter (select)
    else if (target === selectDifficultyFilter) {
        const selectedLevel = Number(selectDifficultyFilter.value);
        if (selectedLevel) {
            filteredTodos = allTodos.filter((todo) => todo.level === selectedLevel);
        }
        // Reset other filters
        if (selectCategoryFilter)
            selectCategoryFilter.value = '';
        const statusSpans = ['filter-total', 'filter-completed', 'filter-remaining'];
        statusSpans.forEach((id) => {
            var _a;
            (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.classList.remove('primary-color');
        });
    }
    // Apply result
    todos = sortTodos(filteredTodos);
    if (todos.length === 0) {
        ShowEmptyTaskMessage();
    }
    // Clean + render
    const taskItems = tasksContainer.querySelectorAll('.task-item');
    taskItems.forEach((item) => item.remove());
    showTodos();
    updateFooterStat();
};
// Select Sort Mode
sortButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const clickedBtn = e.currentTarget;
        const sortMode = e.currentTarget.dataset.sort;
        if (sortMode) {
            currentSortMode = sortMode;
            sortToggleBtn.innerHTML = clickedBtn.innerHTML;
            applyFilters(e);
            closeSortDropDown();
        }
    });
});
// Update Selected status Color text
const updateStatusUI = (selected) => {
    const ids = ['filter-total', 'filter-completed', 'filter-remaining'];
    ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el)
            el.classList.remove('primary-color');
    });
    selected.classList.add('primary-color');
};
// Reset Stars to one yellow star
const resetStars = () => {
    difficultyLevels.forEach((btn, i) => {
        if (i > 0) {
            btn.classList.add('text-gray-300');
            btn.classList.remove('text-yellow-400');
        }
    });
};
// Change difficulty Levels
difficultyLevels.forEach((level, index) => {
    level.addEventListener('click', () => {
        const isGray = level.classList.contains('text-gray-300');
        difficultyLevels.forEach((btn, i) => {
            if (isGray && i <= index) {
                btn.classList.add('text-yellow-400');
                btn.classList.remove('text-gray-300');
            }
            else if (i > index) {
                btn.classList.add('text-gray-300');
                btn.classList.remove('text-yellow-400');
            }
        });
    });
});
window.editTask = function (event, taskId) {
    const span = event.target;
    const currentTitle = span.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = (currentTitle !== null && currentTitle !== void 0 ? currentTitle : '').trim();
    input.className =
        'flex-1 w-full px-2 py-1 pr-14 rounded-lg border-1 dark:border-gray-500 bg-gray-50 dark:bg-gray-600 dark:text-gray-300 dark:placeholder-gray-400 border-gray-200 text-gray-800 placeholder-gray-500 input-focus';
    input.addEventListener('blur', () => window.saveEditedTitle(input, taskId));
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            input.blur(); // Trigger blur to save
        }
    });
    span.replaceWith(input);
    input.focus();
};
window.saveEditedTitle = function (input, taskId) {
    const newTitle = input.value.trim();
    if (newTitle.length === 0) {
        notyf.error('Title cannot be empty !');
        input.focus();
        return;
    }
    const newTodo = todos.find((t) => t.id === taskId);
    if (newTodo) {
        newTodo.title = newTitle;
        // Save to localStorage
        localStorage.setItem('todos', JSON.stringify(todos));
    }
    // Replace input with new span
    const span = document.createElement('span');
    span.textContent = newTitle;
    span.className =
        'cursor-pointer transition-all duration-300 text-gray-800 dark:text-gray-200 hover:text-blue-500';
    span.onclick = (e) => window.editTask(e, taskId);
    input.replaceWith(span);
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
window.showDescription = function (e, id) {
    const descriptionBox = document.querySelector(`#desc-${id}`);
    const icon = e.currentTarget;
    icon.classList.toggle('-rotate-180');
    descriptionBox === null || descriptionBox === void 0 ? void 0 : descriptionBox.classList.toggle('h-8');
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
// Event listeners
addTaskBtn === null || addTaskBtn === void 0 ? void 0 : addTaskBtn.addEventListener('click', addTaskHandler);
closeBoxBtn === null || closeBoxBtn === void 0 ? void 0 : closeBoxBtn.addEventListener('click', closeInputBox);
exportBtn === null || exportBtn === void 0 ? void 0 : exportBtn.addEventListener('click', openDropDown);
sortToggleBtn === null || sortToggleBtn === void 0 ? void 0 : sortToggleBtn.addEventListener('click', openSortDropdown);
filterTotal === null || filterTotal === void 0 ? void 0 : filterTotal.addEventListener('click', (e) => applyFilters(e));
filterCompleted === null || filterCompleted === void 0 ? void 0 : filterCompleted.addEventListener('click', (e) => applyFilters(e));
filterRemaining === null || filterRemaining === void 0 ? void 0 : filterRemaining.addEventListener('click', (e) => applyFilters(e));
selectCategoryFilter === null || selectCategoryFilter === void 0 ? void 0 : selectCategoryFilter.addEventListener('change', (e) => applyFilters(e));
selectDifficultyFilter === null || selectDifficultyFilter === void 0 ? void 0 : selectDifficultyFilter.addEventListener('change', (e) => applyFilters(e));
taskInput === null || taskInput === void 0 ? void 0 : taskInput.addEventListener('input', updateTaskInputCount);
descriptionInput === null || descriptionInput === void 0 ? void 0 : descriptionInput.addEventListener('input', updateTextareaCount);
window.addEventListener('load', () => {
    const loader = document.querySelector('#loader-container');
    showTodos();
    applyStoredTheme();
    showTimer();
    loader.classList.add('fade-out');
    loader.addEventListener('animationend', () => {
        loader.classList.add('hidden');
    });
});
