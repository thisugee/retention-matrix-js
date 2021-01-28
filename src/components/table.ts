const render = (data: any[]) => {
  return data.join('')
}

const renderCell = (cell, classes?: string) => {
  return cell
    ? `<div class="table-cell ${classes}">${cell}</div>`
    : `<div class="table-cell ${classes} empty">0</div>`
}

const renderRow = (row, relative = false) => {
  const cells: string[] = Object.keys(row.retention_rel)

  return `
			<div class="table-row">
				${renderCell(row.date_from, 'color-0')}
				${render(
          cells.map((cell) => {
            const value = !relative
              ? row['retention_abs'][cell]
              : `${row['retention_rel'][cell].toFixed(2)}%`

            const colorCode =
              cell === 'cohort_size'
                ? '0'
                : Math.floor(row['retention_rel'][cell] / 10)

            return renderCell(value, `center number color-${colorCode}`)
          })
        )}
			</div>
	`
}

export const renderTable = (container, retention, relative = false) => {
  const headers = Object.keys(retention)
  const rows = Object.values(retention)

  const table = `
		<div class="retention-table">
			<div class="table-header">
				${renderCell('Date', 'head')}
				${renderCell('Size', 'head center')}
				${render(
          headers.slice(1).map((header) => {
            return renderCell(`Period ${Number(header) - 1}`, 'head center')
          })
        )}
			</div>
			${render(rows.map((row) => renderRow(row, relative)))}
		</div>
	`

  container.innerHTML = table
}
