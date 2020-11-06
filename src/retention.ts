import { timestampToDate } from './utils/date'

class Retention {
  private count: number
  private params
  private cohorts = {}

  constructor(params) {
    this.params = params
    this.count = Math.floor((params.end - params.start) / params.period)

    for (let i = 1; i <= this.count; i++) {
      const timestamp_from = params.start + params.period * (i - 1)
      const timestamp_to = timestamp_from + params.period

      this.cohorts[i] = {
        date_from: timestampToDate(timestamp_from, true),
        date_to: timestampToDate(timestamp_to),
        timestamp_from,
        timestamp_to,
        retention_abs: {}, // Absolute retention
        retention_rel: {}, // Relative retention (%)
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
   * @param timestampFrom
   * @param users
   */
  private setInitialUsers(cohortKey: number, users) {
    const cohort = this.cohorts[cohortKey]

    const cohortTimestampFrom = cohort.timestamp_from
    const cohortTimestampTo = cohortTimestampFrom + this.params.period

    const cohortUsers = users.filter((user) => {
      const firstOrderDate = this.getFirstOrderDate(user.orders)
      return (
        firstOrderDate > Number(cohortTimestampFrom) &&
        firstOrderDate < Number(cohortTimestampTo)
      )
    })
    this.cohorts[cohortKey].users = cohortUsers
    this.cohorts[cohortKey].retention_abs[`cohort_size`] = cohortUsers.length
    this.cohorts[cohortKey].retention_rel[`cohort_size`] = 100
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

    const cohortGroupKey = `cohort_group_${cohortGroup}`
    const cohortGroupTimestampFrom =
      cohort.timestamp_from + this.params.period * cohortGroup
    const cohortGroupTimestampTo = cohortGroupTimestampFrom + this.params.period

    const retainedUsers = cohortUsers.filter((user) => {
      return user.orders.some((order) => {
        return (
          order.created_at > Number(cohortGroupTimestampFrom) &&
          order.created_at < Number(cohortGroupTimestampTo)
        )
      })
    })

    this.cohorts[cohortKey].retention_abs[cohortGroupKey] = retainedUsers.length
    this.cohorts[cohortKey].retention_rel[cohortGroupKey] =
      (retainedUsers.length * 100) / cohortUsers.length
  }

  generateData(users) {
    const cohortsArray = Object.entries(this.cohorts)

    cohortsArray.forEach(([cohortKey, cohortData]: any[]) => {
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
