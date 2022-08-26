import fetch from "node-fetch"
import { DateTime } from "luxon"

const baseUrl = "http://webapi.legistar.com/v1/waukesha/"

const years = [
    '2022',
    // '2021',
    // '2020'
]

for (const year of years) {
    let url = `${baseUrl}events?$filter=EventDate+ge+datetime%27${year}-01-01%27+and+EventDate+lt+datetime%27${year}-12-31%27`
    let events = await fetch(url)
        .then(result => {
            return result.text()
        })
        .then(c => {
            return JSON.parse(c)
        })

    for (const e of events) {
        let event = {
            Id: e.EventId,
            Guid: e.EventGuid,
            LastModifiedUtc: e.EventLastModifiedUtc,
            EventDesc: e.EventBodyName,
            Agenda: e.EventAgendaFile ?? null,
            Minutes: e.EventMinutesFile ?? null,
            AgendaPublished: e.EventAgendaLastPublishedUTC ?? null,
            MinutesPublished: e.EventMinutesLastPublishedUTC ?? null
        }
        
        if (e.EventDate && e.EventTime) {
            let dateParts = e.EventDate.split('T')[0].split('-')

            let timeParts = e.EventTime.split(' ')
            timeParts[0] = timeParts[0].split(':')
            timeParts = timeParts.flat()

            let meetingTime = DateTime.fromObject({
                year: parseInt(dateParts[0]),
                month: parseInt(dateParts[1]),
                day: parseInt(dateParts[2]),
                hour: timeParts[2] === 'PM' ? parseInt(timeParts[0]) + 12 : parseInt(timeParts[0]),
                minute: parseInt(timeParts[1])
            }, {
                zone: 'America/Chicago'
            })

            event["DateTime"] = meetingTime.toISO()
        } else {
            event["DateTime"] = null
        }

        console.log(event)
    }
}