import React, { useEffect, useState } from "react"
import { Layout } from "../components/layout"

import { DateTime } from "luxon"

type OpeningHoursJson = {
  closingDays: Array<ClosingDaysEntry>
  openingHours: Array<OpeningHoursEntry>
}

function isOpeningHoursJson(value: any): value is OpeningHoursJson {
  if (value) {
    return Array.isArray(value?.closingDays) && Array.isArray(value?.openingHours)
  } else {
    return false
  }
}

type ClosingDaysEntry = {
  comment?: string
  from: string
  to?: string
  startTime?: string
  endTime?: string
  link?: string
}

type ClosingDaysEntryWithDateTime = ClosingDaysEntry & {
  startTimeDT?: DateTime
  endTimeDT?: DateTime
}

type OpeningHoursEntry = {
  date: string
  startTime: string
  endTime: string
  helpers: Array<string>
  comment?: string
}

type OpeningHoursEntryWithDateTime = OpeningHoursEntry & {
  dateDT: DateTime
  startTimeDT: DateTime
  endTimeDT: DateTime
}

// only the info we need for displaying (e.g. no helpers required for this)
type OpeningHoursDisplayEntry = {
  key: string
  dateDT: DateTime
  startTimeDT: DateTime
  endTimeDT: DateTime
  helpers: Array<string>
  comment?: string
}

function transformClosingDaysEntries(entries: Array<ClosingDaysEntry>): Array<ClosingDaysEntryWithDateTime> {
  return entries.map((entry) => {
    const startTimeDT = entry.startTime ? DateTime.fromISO(entry.startTime) : undefined
    const endTimeDT = entry.endTime ? DateTime.fromISO(entry.endTime) : undefined
    return {
      ...entry,
      startTimeDT,
      endTimeDT,
    }
  })
}

function transformOpeningHoursEntries(entries: Array<OpeningHoursEntry>): Array<OpeningHoursDisplayEntry> {
  return entries
    .map((entry) => {
      const dateDT = DateTime.fromISO(entry.date)

      const start = DateTime.fromISO(entry.startTime)
      const end = DateTime.fromISO(entry.endTime)

      return {
        ...entry,
        key: `${entry.date}-${entry.startTime}-${entry.endTime}`,
        dateDT,
        startTimeDT: dateDT.set({ hour: start.hour, minute: start.minute }),
        endTimeDT: dateDT.set({ hour: end.hour, minute: end.minute }),
      } satisfies OpeningHoursDisplayEntry
    })
    .filter((entry) => entry.dateDT > minimumDateToShow)
}

function ClosingDayItem({ entry }: { entry: ClosingDaysEntryWithDateTime }) {
  const timeContent = entry.to
    ? `${DateTime.fromISO(entry.from).toLocaleString(DateTime.DATE_FULL)} - ${DateTime.fromISO(entry.to).toLocaleString(DateTime.DATE_FULL)}`
    : DateTime.fromISO(entry.from).toLocaleString(DateTime.DATE_FULL)

  const content = (
    <span>
      {timeContent}
      {entry.comment ? ` - ${entry.comment}` : ""}
    </span>
  )

  if (entry.link) {
    return (
      <a href={entry.link} target="_blank">
        {content}
      </a>
    )
  } else {
    return content
  }
}

// We want to show all future opening hours and those of today and yesterday
const minimumDateToShow = DateTime.now().minus({ day: 1 })

const FETCH_URL = "/opening-hours.json"

function OpeningHoursPage() {
  const [openingHours, setOpeningHours] = useState<Array<OpeningHoursDisplayEntry>>([])
  const [closingDays, setClosingDays] = useState<Array<ClosingDaysEntryWithDateTime>>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(undefined)

  useEffect(() => {
    fetch(FETCH_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`, { cause: response.statusText })
        }
        return response.json()
      })
      .then((result) => {
        if (isOpeningHoursJson(result)) {
          setOpeningHours(transformOpeningHoursEntries(result.openingHours))
          setClosingDays(transformClosingDaysEntries(result.closingDays))
          setError(undefined)
        } else {
          setError("Load successful but data is not correct. Got:" + JSON.stringify(result))
        }
        setLoading(false)
      })
      .catch((err) => {
        setError(err)
        setLoading(false)
      })
  }, [])

  // TODO: real error handling. Show error message to user
  if (error) {
    console.log("Error loading opening-hours", error)
  }

  return (
    <Layout className="opening-hours">
      <h1>Öffnungszeiten</h1>
      <p>
        Da wir rein ehrenamtlich arbeiten, sind die Öffnungszeiten aktuell noch recht unregelmäßig und können sich
        kurzfristig ändern.
      </p>
      <p>Schau regelmäßig nach, ob es Änderungen gibt.</p>
      <p>
        Es gelten die Nutzungsbedingungen und Eintrittspreis, siehe <a href="/halle">Halle</a>.
      </p>

      {loading ? (
        <>
          <p>Loading...</p>
        </>
      ) : (
        <>
          {closingDays.length > 0 && (
            <>
              <p>
                In folgenden Zeiträumen haben wir generell <strong>geschlossen</strong>:
              </p>
              <ul>
                {closingDays.map((closingDayEntry) => (
                  <li key={`${closingDayEntry.from}`}>
                    <ClosingDayItem key={closingDayEntry.from} entry={closingDayEntry} />
                  </li>
                ))}
              </ul>
            </>
          )}
          <br />
          <h3>Öffnungszeiten:</h3>
          {openingHours.length === 0 && <p>Aktuell keine Öffnungszeiten :-(</p>}
          {openingHours.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Zeit</th>
                  <th>Betreuer</th>
                  <th>Hinweise</th>
                </tr>
              </thead>
              <tbody>
                {openingHours.map((entry) => (
                  <tr key={entry.key}>
                    <td>{entry.dateDT.toLocaleString(DateTime.DATE_FULL)}</td>
                    <td>
                      <time>{entry.startTimeDT.toLocaleString(DateTime.TIME_24_SIMPLE)}</time>-
                      <time>{entry.endTimeDT.toLocaleString(DateTime.TIME_24_SIMPLE)}</time>
                      Uhr
                    </td>
                    <td>{entry.helpers.join(", ")}</td>
                    <td>
                      <strong>{entry.comment}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </Layout>
  )
}

export default OpeningHoursPage
