const toggleThemeBtn = document.querySelector('#toggle-theme'); /* prettier-ignore */
const colorDropdown = document.querySelector('#color-drop-down'); /* prettier-ignore */
const colorPickerBtn = document.querySelector('#color-picker-btn'); /* prettier-ignore */
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
function toggleColorDropdown() {
    colorDropdown.classList.toggle('hidden');
    colorDropdown.classList.toggle('show');
}
html.addEventListener('click', function (event) {
    if (!colorDropdown || !colorPickerBtn)
        return;
    if (colorDropdown.contains(event.target) ||
        colorPickerBtn.contains(event.target)) {
        return;
    }
    colorDropdown.classList.add('hidden');
    colorDropdown.classList.remove('show');
});
window.applyPrimaryColors = function (base, hover, border) {
    document.documentElement.style.setProperty('--primary-color', base);
    document.documentElement.style.setProperty('--primary-color-hover', hover);
    document.documentElement.style.setProperty('--primary-border-color', border);
    // Close DropDown after Choose Color
    colorDropdown.classList.add('hidden');
};
// Event listeners
toggleThemeBtn === null || toggleThemeBtn === void 0 ? void 0 : toggleThemeBtn.addEventListener('click', changeDarkMode);
colorPickerBtn === null || colorPickerBtn === void 0 ? void 0 : colorPickerBtn.addEventListener('click', toggleColorDropdown);
