const toggleThemeBtn = document.querySelector('#toggle-theme') as HTMLButtonElement /* prettier-ignore */
const colorDropdown = document.querySelector('#color-drop-down') as HTMLButtonElement /* prettier-ignore */
const colorPickerBtn = document.querySelector('#color-picker-btn') as HTMLButtonElement /* prettier-ignore */
const icon = document.querySelector('#toggle-theme i') as HTMLElement
const html = document.querySelector('html') as HTMLHtmlElement
const storageKey = 'todoPlus-isDarkTheme'

//Set dark theme status in localstorage
export const applyStoredTheme = () => {
	const isDark = JSON.parse(localStorage.getItem(storageKey) || 'false')

	if (isDark) {
		html.classList.add('dark')
		icon?.classList.replace('far', 'fas')
	} else {
		html.classList.remove('dark')
		icon?.classList.replace('fas', 'far')
	}
}

// Change theme with click
const changeDarkMode = () => {
	const isDarkNow = html.classList.toggle('dark')

	localStorage.setItem(storageKey, JSON.stringify(isDarkNow))

	if (isDarkNow) {
		icon?.classList.replace('far', 'fas')
	} else {
		icon?.classList.replace('fas', 'far')
	}
}

function toggleColorDropdown() {
	colorDropdown.classList.toggle('hidden')
	colorDropdown.classList.toggle('show')
}

html.addEventListener('click', function (event) {
	if (!colorDropdown || !colorPickerBtn) return

	if (
		colorDropdown.contains(event.target as Node) ||
		colorPickerBtn.contains(event.target as Node)
	) {
		return
	}

	colorDropdown.classList.add('hidden')
	colorDropdown.classList.remove('show')
})
;(window as any).applyPrimaryColors = function (
	base: string,
	hover: string,
	border: string
) {
	document.documentElement.style.setProperty('--primary-color', base)
	document.documentElement.style.setProperty('--primary-color-hover', hover)
	document.documentElement.style.setProperty('--primary-border-color', border)

	// Close DropDown after Choose Color
	colorDropdown.classList.add('hidden')
}

// Event listeners
toggleThemeBtn?.addEventListener('click', changeDarkMode)
colorPickerBtn?.addEventListener('click', toggleColorDropdown)
