const escapeCsvCell = (cell: string | number) => {
  const str = String(cell)
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
}

export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCsvCell).join(","))
    .join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
