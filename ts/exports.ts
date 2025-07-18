const exportJsonBtn = document.querySelector('#exprt-json') as HTMLButtonElement
const exportCsvBtn = document.querySelector('#exprt-csv') as HTMLButtonElement
const exportPdfBtn = document.querySelector('#exprt-pdf') as HTMLButtonElement

const datas = JSON.parse(localStorage.getItem('todos') || '[]')

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
	const jsonStr = JSON.stringify(datas, null, 2)
	downloadFile(jsonStr, 'application/json', 'todos.json')
}

// Export to CSV
const exportAsCsv = () => {
	if (datas.length === 0) return

	const headers = Object.keys(datas[0])
	const csvRows = [
		headers.join(','), // header row
		...datas.map((data: any) =>
			headers
				.map((h) => `"${(data[h] ?? '').toString().replace(/"/g, '""')}"`)
				.join(',')
		),
	]

	const csvContent = csvRows.join('\n')
	downloadFile(csvContent, 'text/csv', 'todos.csv')
}

// Export to PDF using jsPDF
const exportAsPdf = async () => {
	if (datas.length === 0) return

	// @ts-ignore
	const { jsPDF } = window.jspdf
	const doc = new jsPDF()
	let y = 10

	datas.forEach((task: any, index: number) => {
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
}

// Event listeners
exportJsonBtn.addEventListener('click', exportAsJson)
exportCsvBtn.addEventListener('click', exportAsCsv)
exportPdfBtn.addEventListener('click', exportAsPdf)
