import { timestampToDate } from './utils/date'

class Retention {
  private count: number
  private params
  private cohorts = {}

  constructor(params) {
    this.params = params
    this.count = Math.floor((params.end - params.start) / params.period)

    for (let i = 1; i <= this.count; i++) {
      const from_timestamp = params.start + params.period * (i - 1)
      const to_timestamp = from_timestamp + params.period

      this.cohorts[i] = {
        from_date: timestampToDate(from_timestamp, true),
        to_date: timestampToDate(to_timestamp),
        from_timestamp,
        to_timestamp,
        absolute: {}, // Absolute retention
        relative: {}, // Relative retention (%)
        users: [],
      }
    }
  }

  private getFirstOrderDate(orders) {
    const orderDates = orders.map((order) => order.created_at)
    return Math.min(...orderDates)
  }

  /**
   * Get all users that belong to the cohort
   * and set initial cohort size
   *
   * @param cohortKey
   * @param users
   */
  private setInitialUsers(cohortKey: number, users) {
    const cohort = this.cohorts[cohortKey]

    const cohortFromTimestamp = cohort.from_timestamp
    const cohortToTimestamp = cohortFromTimestamp + this.params.period

    const cohortUsers = users.filter((user) => {
      const firstOrderDate = this.getFirstOrderDate(user.orders)
      return (
        firstOrderDate > Number(cohortFromTimestamp) &&
        firstOrderDate < Number(cohortToTimestamp)
      )
    })
    this.cohorts[cohortKey].users = cohortUsers
    this.cohorts[cohortKey].absolute[`size`] = cohortUsers.length
    this.cohorts[cohortKey].relative[`size`] = 100
  }

  /**
   * Set retained users
   *
   * @param cohortKey
   * @param cohortGroup
   */
  private setRetainedUsers(cohortKey: number, cohortGroup) {
    const cohort = this.cohorts[cohortKey]
    const cohortUsers = cohort.users

    const cohortGroupKey = `period_${cohortGroup}`
    const cohortGroupFromTimestamp =
      cohort.from_timestamp + this.params.period * cohortGroup
    const cohortGroupToTimestamp = cohortGroupFromTimestamp + this.params.period

    const retainedUsers = cohortUsers.filter((user) => {
      return user.orders.some((order) => {
        return (
          order.created_at > Number(cohortGroupFromTimestamp) &&
          order.created_at < Number(cohortGroupToTimestamp)
        )
      })
    })

    this.cohorts[cohortKey].absolute[cohortGroupKey] = retainedUsers.length
    this.cohorts[cohortKey].relative[cohortGroupKey] =
      (retainedUsers.length * 100) / cohortUsers.length
  }

  generateData(users) {
    const cohortsArray = Object.entries(this.cohorts)

    cohortsArray.forEach(([cohortKey]: any[]) => {
      this.setInitialUsers(cohortKey, users)

      if (cohortKey <= cohortsArray.length) {
        let cohortGroup = 1

        do {
          this.setRetainedUsers(cohortKey, cohortGroup)
          cohortGroup += 1
        } while (cohortGroup < cohortsArray.length)
      }
    })

    return this.cohorts
  }
}

export default Retention
