const { SQLDataSource } = require('../../utils/sqlDataSource')

const conferenceColumns = ['Id', 'Name', 'ConferenceTypeId', 'LocationId', 'CategoryId', 'StartDate', 'EndDate']

class ConferenceDb extends SQLDataSource {
  generateWhereClause(queryBuilder, filters = {}) {
    const { startDate, endDate, organizerEmail } = filters
    if (startDate) queryBuilder.andWhere('StartDate', '>=', startDate)
    if (endDate) queryBuilder.andWhere('StartDate', '<=', endDate)
    if (organizerEmail) queryBuilder.andWhere('OrganizerEmail', organizerEmail)
  }

  async getConferenceList(pager, filters) {
    const { page, pageSize } = pager
    const values = await this.knex
      .select(...conferenceColumns)
      .from('Conference')
      .modify(this.generateWhereClause, filters)
      .orderBy('Id')
      .offset(page * pageSize)
      .limit(pageSize)
    return { values }
  }

  async getConferenceListTotalCount(filters) {
    return await this.knex('Conference').count('Id', { as: 'TotalCount' }).modify(this.generateWhereClause, filters).first()
  }

  async getConferenceById(id) {
    const result = await this.knex
      .select(...conferenceColumns)
      .from('Conference')
      .where('Id', id)
      .first()
    return result
  }

  async updateConferenceXAttendee({ attendeeEmail, conferenceId, statusId }) {
    const current = await this.knex
      .select('Id', 'AttendeeEmail', 'ConferenceId')
      .from('ConferenceXAttendee')
      .where('AttendeeEmail', attendeeEmail)
      .andWhere('ConferenceId', conferenceId)
      .first()

    const attendeeInfo = {
      AttendeeEmail: attendeeEmail,
      ConferenceId: conferenceId,
      StatusId: statusId
    }
    let result
    if (current && current.id) {
      result = await this.knex('ConferenceXAttendee').update(attendeeInfo, 'StatusId').where('Id', current.id)
    } else {
      result = await this.knex('ConferenceXAttendee').returning('StatusId').insert(attendeeInfo)
    }
    return result[0]
  }
}

module.exports = ConferenceDb
