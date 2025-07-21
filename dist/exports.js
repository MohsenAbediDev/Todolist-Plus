var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// @ts-ignore
import { closeDropDown, todos, notyf } from '../dist/app.js';
// prettier-ignore
const exportJsonBtn = document.querySelector('#export-json');
const exportCsvBtn = document.querySelector('#export-csv');
const exportPdfBtn = document.querySelector('#export-pdf');
const getJsonFileInput = document.querySelector('#jsonFile');
const fileSpan = document.querySelector('#show-backup-file'); /* prettier-ignore */
const fileInput = document.querySelector('#file-input'); /* prettier-ignore */
const importBackupBtn = document.querySelector('#import-backup'); /* prettier-ignore */
const backupModal = document.querySelector('#backup-modal');
const closeModalBtn = document.querySelector('#close-backup-modal'); /* prettier-ignore */
const uploadBackupFileBtn = document.querySelector('#upload-backup-file'); /* prettier-ignore */
// General download function for JSON & CSV
const downloadFile = (content, type, filename) => {
    const blob = new Blob([content], { type });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
};
// Export to JSON
const exportAsJson = () => {
    if (todos.length > 0) {
        const jsonStr = JSON.stringify(todos, null, 2);
        downloadFile(jsonStr, 'application/json', 'todos.json');
        closeDropDown();
    }
    else {
        notyf.error('Please add task first !');
        closeDropDown();
    }
};
// Export to CSV
const exportAsCsv = () => {
    if (todos.length > 0) {
        const headers = Object.keys(todos[0]);
        const csvRows = [
            headers.join(','), // header row
            ...todos.map((data) => headers
                .map((h) => { var _a; return `"${((_a = data[h]) !== null && _a !== void 0 ? _a : '').toString().replace(/"/g, '""')}"`; })
                .join(',')),
        ];
        const csvContent = csvRows.join('\n');
        downloadFile(csvContent, 'text/csv', 'todos.csv');
        closeDropDown();
    }
    else {
        notyf.error('Please add task first !');
        closeDropDown();
    }
};
// Export to PDF using jsPDF
const exportAsPdf = () => __awaiter(void 0, void 0, void 0, function* () {
    if (todos.length > 0) {
        // @ts-ignore
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let y = 10;
        todos.forEach((task, index) => {
            doc.text(`Task ${index + 1}`, 10, y);
            y += 7;
            for (const key in task) {
                const val = typeof task[key] === 'boolean'
                    ? task[key]
                        ? '✓'
                        : '✗'
                    : String(task[key]);
                doc.text(`${key}: ${val}`, 15, y);
                y += 6;
            }
            y += 4;
            if (y > 270) {
                doc.addPage();
                y = 10;
            }
        });
        doc.save('todos.pdf');
        closeDropDown();
    }
    else {
        notyf.error('Please add task first !');
        closeDropDown();
    }
});
// Show Backup Modal
const showBackupModal = () => {
    backupModal.classList.remove('hidden');
    backupModal.classList.remove('fade-in');
    backupModal.classList.remove('fade-out');
};
// close Backup Modal
const closeBackupModal = () => {
    backupModal.classList.add('fade-out');
    backupModal.classList.remove('fade-in');
    backupModal.addEventListener('animationend', () => {
        backupModal.classList.add('hidden');
    }, { once: true });
};
// Show File name to modal
const getFileName = () => {
    if (!getJsonFileInput.files) {
        notyf.error('No files selected !');
        return;
    }
    const file = getJsonFileInput === null || getJsonFileInput === void 0 ? void 0 : getJsonFileInput.files[0];
    fileSpan.textContent = file.name;
    fileInput.classList.add('hidden');
    fileSpan.classList.remove('hidden');
};
// Import Data With JSON and Set to LocalStorage
const importAsJson = () => {
    if (!getJsonFileInput.files) {
        notyf.error('No files selected !');
        return;
    }
    const file = getJsonFileInput === null || getJsonFileInput === void 0 ? void 0 : getJsonFileInput.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
        const target = event.target;
        const result = target.result;
        if (typeof result !== 'string') {
            notyf.error('The file value is not a string!');
            return;
        }
        try {
            const jsonData = JSON.parse(result);
            // Set datas to localstorage
            localStorage.setItem('todos', JSON.stringify(jsonData));
            notyf.success('Data imported successfully !');
        }
        catch (e) {
            notyf.error('JSON file is not valid !');
        }
    };
    fileSpan.classList.add('hidden');
    fileInput.classList.remove('hidden');
    reader.readAsText(file);
};
// Event listeners
exportJsonBtn.addEventListener('click', exportAsJson);
exportCsvBtn.addEventListener('click', exportAsCsv);
exportPdfBtn.addEventListener('click', exportAsPdf);
importBackupBtn.addEventListener('click', showBackupModal);
closeModalBtn.addEventListener('click', closeBackupModal);
getJsonFileInput.addEventListener('input', getFileName);
uploadBackupFileBtn.addEventListener('click', importAsJson);
