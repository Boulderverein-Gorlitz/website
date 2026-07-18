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
}

type OpeningHoursEntry = {
  date: string
  startTime: string
  endTime: string
  helpers: Array<string>
}

type OpeningHoursEntryWithDateTime = OpeningHoursEntry & {
  dateDT: DateTime
  startTimeDT: DateTime
  endTimeDT: DateTime
}

// only those info we need for displaying (e.g. no helpers required for this)
type OpeningHoursDisplayEntry = {
  dateDT: DateTime
  startTimeDT: DateTime
  endTimeDT: DateTime
  helpers: Array<string>
}

function transformOpeningHoursEntries(
  entries: Array<OpeningHoursEntry>,
  referenceTime: DateTime,
): Array<OpeningHoursDisplayEntry> {
  return entries
    .map((entry) => {
      const dateDT = DateTime.fromISO(entry.date)

      const start = DateTime.fromISO(entry.startTime)
      const end = DateTime.fromISO(entry.endTime)

      return {
        ...entry,
        dateDT,
        startTimeDT: dateDT.set({ hour: start.hour, minute: start.minute }),
        endTimeDT: dateDT.set({ hour: end.hour, minute: end.minute }),
      } satisfies OpeningHoursEntryWithDateTime
    })
    .filter((entry) => entry.dateDT > minimumDateToShow)
    .reduce<Array<OpeningHoursDisplayEntry>>((prev, curr) => {
      const existingEntry = prev.find((entry) => entry.dateDT.toISODate() === curr.dateDT.toISODate())

      if (existingEntry) {
        // expand the start/end time when there are overlapping times.
        existingEntry.startTimeDT = DateTime.min(existingEntry.startTimeDT, curr.startTimeDT)
        existingEntry.endTimeDT = DateTime.max(existingEntry.endTimeDT, curr.endTimeDT)
        existingEntry.helpers = [...new Set([...existingEntry.helpers, ...curr.helpers])]
        return prev
      } else {
        return [
          ...prev,
          {
            dateDT: curr.dateDT,
            startTimeDT: curr.startTimeDT,
            endTimeDT: curr.endTimeDT,
            helpers: curr.helpers,
          },
        ]
      }
    }, [])
}

// We want to show all future opening hours and those of today and yesterday
const minimumDateToShow = DateTime.now().minus({ day: 1 })

const FETCH_URL = "/opening-hours.json"

function OpeningHoursPage() {
  const [openingHours, setOpeningHours] = useState<Array<OpeningHoursDisplayEntry>>([])
  const [closingDays, setClosingDays] = useState<Array<ClosingDaysEntry>>([])

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
          setOpeningHours(transformOpeningHoursEntries(result.openingHours, minimumDateToShow))
          setClosingDays(result.closingDays)
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
      <p>Es gelten die Nutzungsbedingungen und Eintrittspreis, siehe <a href="/halle">Halle</a>.</p>

      {loading ? (
        <>
          <p>Loading...</p>
        </>
      ) : (
        <>
          {closingDays.length > 0 && (
            <>
              <p>In folgenden Zeiträumen haben wir generell geschlossen:</p>
              <ul>
                {closingDays.map((closingDayEntry) => {
                  if (closingDayEntry.to) {
                    return (
                      <li>
                        {DateTime.fromISO(closingDayEntry.from).toLocaleString(DateTime.DATE_FULL)} - {DateTime.fromISO(closingDayEntry.to).toLocaleString(DateTime.DATE_FULL)}
                      </li>
                    )
                  } else {
                    return <li>{DateTime.fromISO(closingDayEntry.from).toLocaleString(DateTime.DATE_FULL)}</li>
                  }
                })}
              </ul>
            </>
          )}
          <br />
          {openingHours.length === 0 && <p>Aktuell keine Öffnungszeiten :-(</p>}
          {openingHours.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Zeit</th>
                  <th>Betreuer</th>
                </tr>
              </thead>
              <tbody>
                {openingHours.map((entry) => (
                  <tr key={`entry_${entry.dateDT.toISODate()}`}>
                    <td>{entry.dateDT.toLocaleString(DateTime.DATE_FULL)}</td>
                    <td>
                      <time>{entry.startTimeDT.toLocaleString(DateTime.TIME_24_SIMPLE)}</time>-
                      <time>{entry.endTimeDT.toLocaleString(DateTime.TIME_24_SIMPLE)}</time>
                      Uhr
                    </td>
                    <td>{entry.helpers.join(", ")}</td>
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
