
import Retention from './retention'
import { renderTable } from './components/table'
import users from './data/users'

// default retention params
const retention = new Retention({
  start: 1604188800,
  end: 1606694400,
  period: 604800, // weekly
})

// generate retention data
const retentionData = retention.generateData(users)
console.log('>>> Retention', retentionData)

// render retention data on table
const container = document.getElementById('table')
renderTable(container, retentionData)

// toggle relative or absolute values
const relativeToggle = document.getElementById('relative-toggle')
relativeToggle?.addEventListener('change', (event: any) => {
  renderTable(container, retentionData, event?.target?.checked)
})
