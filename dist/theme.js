const toggleThemeBtn = document.querySelector('#toggle-theme');
const icon = document.querySelector('#toggle-theme i');
const html = document.querySelector('html');
const storageKey = 'todoPlus-isDarkTheme';
//Set dark theme status in localstorage
export const applyStoredTheme = () => {
    const isDark = JSON.parse(localStorage.getItem(storageKey) || 'false');
    if (isDark) {
        html.classList.add('dark');
        icon === null || icon === void 0 ? void 0 : icon.classList.replace('far', 'fas');
    }
    else {
        html.classList.remove('dark');
        icon === null || icon === void 0 ? void 0 : icon.classList.replace('fas', 'far');
    }
};
// Change theme with click
const changeDarkMode = () => {
    const isDarkNow = html.classList.toggle('dark');
    localStorage.setItem(storageKey, JSON.stringify(isDarkNow));
    if (isDarkNow) {
        icon === null || icon === void 0 ? void 0 : icon.classList.replace('far', 'fas');
    }
    else {
        icon === null || icon === void 0 ? void 0 : icon.classList.replace('fas', 'far');
    }
};
// Event listeners
toggleThemeBtn === null || toggleThemeBtn === void 0 ? void 0 : toggleThemeBtn.addEventListener('click', changeDarkMode);
