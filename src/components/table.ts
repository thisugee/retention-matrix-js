const render = (data: any[]) => {
  return data.join('')
}

const renderCell = (cell, classes?: string) => {
  return cell
    ? `<div class="table-cell ${classes}">${cell}</div>`
    : `<div class="table-cell ${classes} empty">0</div>`
}

const renderRow = (row, relative = false) => {
  const groups: string[] = Object.keys(row.relative) // row cells

  return `
			<div class="table-row">
				${renderCell(row.from_date, 'color-0')}
				${render(
          groups.map((group) => {
            const value = !relative
              ? row['absolute'][group]
              : `${row['relative'][group].toFixed(2)}%`

            const colorCode =
              group === 'size'
                ? '0'
                : Math.floor(row['relative'][group] / 10)

            return renderCell(value, `center number color-${colorCode}`)
          })
        )}
			</div>
	`
}

export const renderTable = (container, retention, relative = false) => {
  const headers = Object.keys(retention)
  const cohorts = Object.values(retention)

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
			${render(cohorts.map((cohort) => renderRow(cohort, relative)))}
		</div>
	`

  container.innerHTML = table
}
