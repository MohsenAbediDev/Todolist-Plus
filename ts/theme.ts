const toggleThemeBtn = document.querySelector('#toggle-theme') as HTMLButtonElement
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

// Event listeners
toggleThemeBtn?.addEventListener('click', changeDarkMode)
