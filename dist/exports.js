"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const exportJsonBtn = document.querySelector('#exprt-json');
const exportCsvBtn = document.querySelector('#exprt-csv');
const exportPdfBtn = document.querySelector('#exprt-pdf');
const datas = JSON.parse(localStorage.getItem('todos') || '[]');
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
    const jsonStr = JSON.stringify(datas, null, 2);
    downloadFile(jsonStr, 'application/json', 'todos.json');
};
// Export to CSV
const exportAsCsv = () => {
    if (datas.length === 0)
        return;
    const headers = Object.keys(datas[0]);
    const csvRows = [
        headers.join(','), // header row
        ...datas.map((data) => headers
            .map((h) => { var _a; return `"${((_a = data[h]) !== null && _a !== void 0 ? _a : '').toString().replace(/"/g, '""')}"`; })
            .join(',')),
    ];
    const csvContent = csvRows.join('\n');
    downloadFile(csvContent, 'text/csv', 'todos.csv');
};
// Export to PDF using jsPDF
const exportAsPdf = () => __awaiter(void 0, void 0, void 0, function* () {
    if (datas.length === 0)
        return;
    // @ts-ignore
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;
    datas.forEach((task, index) => {
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
});
// Event listeners
exportJsonBtn.addEventListener('click', exportAsJson);
exportCsvBtn.addEventListener('click', exportAsCsv);
exportPdfBtn.addEventListener('click', exportAsPdf);
