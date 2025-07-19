// @ts-ignore
import { closeDropDown, todos } from '../dist/app.js'

// prettier-ignore
const exportJsonBtn = document.querySelector('#export-json') as HTMLButtonElement
const exportCsvBtn = document.querySelector('#export-csv') as HTMLButtonElement
const exportPdfBtn = document.querySelector('#export-pdf') as HTMLButtonElement
// prettier-ignore
const importBackupBtn = document.querySelector('#import-backup') as HTMLButtonElement
const backupModal = document.querySelector('#backup-modal') as HTMLDivElement

// General download function for JSON & CSV
const downloadFile = (content: string, type: string, filename: string) => {
	const blob = new Blob([content], { type })
	const link = document.createElement('a')
	link.href = URL.createObjectURL(blob)
	link.download = filename
	link.click()
}

// Export to JSON
const exportAsJson = () => {
	const jsonStr = JSON.stringify(todos, null, 2)
	downloadFile(jsonStr, 'application/json', 'todos.json')
	closeDropDown()
}

// Export to CSV
const exportAsCsv = () => {
	if (todos.length === 0) return

	const headers = Object.keys(todos[0])
	const csvRows = [
		headers.join(','), // header row
		...todos.map((data: any) =>
			headers
				.map((h) => `"${(data[h] ?? '').toString().replace(/"/g, '""')}"`)
				.join(',')
		),
	]

	const csvContent = csvRows.join('\n')
	downloadFile(csvContent, 'text/csv', 'todos.csv')
	closeDropDown()
}

// Export to PDF using jsPDF
const exportAsPdf = async () => {
	if (todos.length === 0) return

	// @ts-ignore
	const { jsPDF } = window.jspdf
	const doc = new jsPDF()
	let y = 10

	todos.forEach((task: any, index: number) => {
		doc.text(`Task ${index + 1}`, 10, y)
		y += 7

		for (const key in task) {
			const val =
				typeof task[key] === 'boolean'
					? task[key]
						? '✓'
						: '✗'
					: String(task[key])
			doc.text(`${key}: ${val}`, 15, y)
			y += 6
		}

		y += 4
		if (y > 270) {
			doc.addPage()
			y = 10
		}
	})

	doc.save('todos.pdf')
	closeDropDown()
}

// Import Data With JSON
const importAsJson = () => {
	backupModal.classList.remove('hidden')
	backupModal.classList.add('fade-in')
}

// Event listeners
exportJsonBtn.addEventListener('click', exportAsJson)
exportCsvBtn.addEventListener('click', exportAsCsv)
exportPdfBtn.addEventListener('click', exportAsPdf)
importBackupBtn.addEventListener('click', importAsJson)
