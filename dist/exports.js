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
import { closeDropDown, todos } from '../dist/app.js';
// prettier-ignore
const exportJsonBtn = document.querySelector('#export-json');
const exportCsvBtn = document.querySelector('#export-csv');
const exportPdfBtn = document.querySelector('#export-pdf');
// prettier-ignore
const importBackupBtn = document.querySelector('#import-backup');
const backupModal = document.querySelector('#backup-modal');
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
    const jsonStr = JSON.stringify(todos, null, 2);
    downloadFile(jsonStr, 'application/json', 'todos.json');
    closeDropDown();
};
// Export to CSV
const exportAsCsv = () => {
    if (todos.length === 0)
        return;
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
};
// Export to PDF using jsPDF
const exportAsPdf = () => __awaiter(void 0, void 0, void 0, function* () {
    if (todos.length === 0)
        return;
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
});
// Import Data With JSON
const importAsJson = () => {
    backupModal.classList.remove('hidden');
    backupModal.classList.add('fade-in');
};
// Event listeners
exportJsonBtn.addEventListener('click', exportAsJson);
exportCsvBtn.addEventListener('click', exportAsCsv);
exportPdfBtn.addEventListener('click', exportAsPdf);
importBackupBtn.addEventListener('click', importAsJson);
