import users from './data/users'
import Retention from './retention'
import { renderTable } from './components/table'

const retention = new Retention({
  start: 1604188800,
  end: 1606694400,
  period: 604800, // weekly
})
const retentionData = retention.generateData(users)

console.log('>>> Retention', retentionData)

const container = document.getElementById('table')
renderTable(container, retentionData)

const relativeToggle = document.getElementById('relative-toggle')
relativeToggle?.addEventListener('change', (event: any) => {
  renderTable(container, retentionData, event?.target?.checked)
})
