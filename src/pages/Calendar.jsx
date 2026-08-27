import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  calendarFeedUrl,
  getPublishedEvents,
  isCalendarConfigured,
  submitCalendarEvent,
} from '../lib/calendar.js'

const calendarTimeZone = 'America/New_York'
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const categories = [
  'Community',
  'Festival',
  'Live Music',
  'Arts & Culture',
  'Outdoors',
  'Family',
  'Government',
  'Other',
]

const CalendarMarkIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="13" width="46" height="42" rx="5" />
    <path d="M20 8v11M44 8v11M9 26h46" />
    <path d="m24 40 6 6 12-14" />
  </svg>
)

const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
)

function easternDateParts(value = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: calendarTimeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(value)
  const result = Object.fromEntries(parts.map(({ type, value: partValue }) => [type, partValue]))

  return {
    year: Number(result.year),
    month: Number(result.month),
    day: Number(result.day),
  }
}

function dateKey(value) {
  const { year, month, day } = easternDateParts(value)
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function localDateKey(value) {
  return [
    value.getFullYear(),
    String(value.getMonth() + 1).padStart(2, '0'),
    String(value.getDate()).padStart(2, '0'),
  ].join('-')
}

function addDaysToDateInput(value, numberOfDays) {
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day + numberOfDays))
  return date.toISOString().slice(0, 10)
}

function zonedDateTimeToIso(dateValue, timeValue = '00:00') {
  const utcGuess = new Date(`${dateValue}T${timeValue}:00.000Z`)

  const getOffset = (date) => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: calendarTimeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(date)
    const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]))
    const asUtc = Date.UTC(
      Number(values.year),
      Number(values.month) - 1,
      Number(values.day),
      Number(values.hour),
      Number(values.minute),
      Number(values.second),
    )
    return asUtc - date.getTime()
  }

  let result = new Date(utcGuess.getTime() - getOffset(utcGuess))
  result = new Date(utcGuess.getTime() - getOffset(result))
  return result.toISOString()
}

function getCalendarDays(monthDate) {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
  const gridStart = new Date(firstDay)
  gridStart.setDate(firstDay.getDate() - firstDay.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart)
    day.setDate(gridStart.getDate() + index)
    return day
  })
}

function formatSchedule(event) {
  const start = new Date(event.start_at)
  const end = event.end_at ? new Date(event.end_at) : null
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: calendarTimeZone,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  if (event.all_day) return `${dateFormatter.format(start)} · All day`

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: calendarTimeZone,
    hour: 'numeric',
    minute: '2-digit',
  })
  const startLabel = `${dateFormatter.format(start)} · ${timeFormatter.format(start)}`

  if (!end) return startLabel
  if (dateKey(start) === dateKey(end)) return `${startLabel}–${timeFormatter.format(end)}`
  return `${startLabel} – ${dateFormatter.format(end)} · ${timeFormatter.format(end)}`
}

function EventDetails({ event, onClose }) {
  const closeButtonRef = useRef(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (keyEvent) => {
      if (keyEvent.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div className="event-modal" role="dialog" aria-modal="true" aria-labelledby="event-modal-title" onMouseDown={onClose}>
      <article className="event-modal__card" onMouseDown={(mouseEvent) => mouseEvent.stopPropagation()}>
        <button ref={closeButtonRef} className="event-modal__close" type="button" aria-label="Close event details" onClick={onClose}>×</button>
        <p className="event-modal__category">{event.category}</p>
        <h2 id="event-modal-title">{event.title}</h2>
        <p className="event-modal__schedule">{formatSchedule(event)}</p>
        {(event.location_name || event.address) && (
          <div className="event-modal__location">
            <PinIcon />
            <p>
              {event.location_name && <strong>{event.location_name}</strong>}
              {event.address && <span>{event.address}</span>}
            </p>
          </div>
        )}
        {event.description && <p className="event-modal__description">{event.description}</p>}
        {event.website_url && (
          <a className="btn btn--primary" href={event.website_url} target="_blank" rel="noreferrer">
            Event website <span aria-hidden="true">↗</span>
          </a>
        )}
      </article>
    </div>
  )
}

function UpcomingEvent({ event, onSelect }) {
  const start = new Date(event.start_at)
  const month = new Intl.DateTimeFormat('en-US', { timeZone: calendarTimeZone, month: 'short' }).format(start)
  const day = new Intl.DateTimeFormat('en-US', { timeZone: calendarTimeZone, day: 'numeric' }).format(start)

  return (
    <button className="upcoming-event" type="button" onClick={() => onSelect(event)}>
      <span className="upcoming-event__date" aria-hidden="true">
        <span>{month}</span>
        <strong>{day}</strong>
      </span>
      <span className="upcoming-event__body">
        <span className="upcoming-event__category">{event.category}</span>
        <strong>{event.title}</strong>
        <span>{event.all_day ? 'All day' : new Intl.DateTimeFormat('en-US', {
          timeZone: calendarTimeZone,
          hour: 'numeric',
          minute: '2-digit',
        }).format(start)}</span>
      </span>
      <span className="upcoming-event__arrow" aria-hidden="true">→</span>
    </button>
  )
}

function CalendarSubscription({ feedUrl, onClose }) {
  const [copyStatus, setCopyStatus] = useState('')
  const webcalUrl = feedUrl.replace(/^https?:\/\//i, 'webcal://')
  const googleSubscriptionUrl = new URL('https://calendar.google.com/calendar/u/0/r')
  googleSubscriptionUrl.searchParams.set('cid', webcalUrl)
  const googleAccountChooserUrl = new URL('https://accounts.google.com/AccountChooser')
  googleAccountChooserUrl.searchParams.set('continue', googleSubscriptionUrl.href)
  const googleCalendarUrl = googleAccountChooserUrl.href

  async function copyFeedUrl() {
    setCopyStatus('')

    try {
      await navigator.clipboard.writeText(feedUrl)
      setCopyStatus('Subscription link copied.')
    } catch {
      const temporaryField = document.createElement('textarea')
      temporaryField.value = feedUrl
      temporaryField.setAttribute('readonly', '')
      temporaryField.style.position = 'fixed'
      temporaryField.style.opacity = '0'
      document.body.appendChild(temporaryField)
      temporaryField.select()
      const copied = document.execCommand('copy')
      temporaryField.remove()
      setCopyStatus(copied ? 'Subscription link copied.' : 'Select and copy the URL below.')
    }
  }

  return (
    <section className="calendar-subscription" id="calendar-subscription" aria-labelledby="calendar-subscription-title">
      <div className="calendar-subscription__heading">
        <div>
          <p className="section-label">Automatic Event Updates</p>
          <h2 id="calendar-subscription-title">Subscribe to the Lee County calendar.</h2>
          <p>Add this live calendar once. Newly published events and schedule changes will sync whenever your calendar app refreshes its subscriptions.</p>
        </div>
        <button className="calendar-subscription__close" type="button" aria-label="Close calendar subscription" onClick={onClose}>×</button>
      </div>

      <div className="calendar-subscription__actions">
        <a className="btn btn--primary" href={webcalUrl}>Apple Calendar</a>
        <a className="btn btn--ghost" href={googleCalendarUrl} target="_blank" rel="noreferrer">Google Calendar</a>
        <button className="btn btn--ghost" type="button" onClick={copyFeedUrl}>Copy for Outlook</button>
      </div>

      <label className="calendar-subscription__url" htmlFor="calendar-subscription-url">
        Calendar subscription URL
      </label>
      <div className="calendar-subscription__url-row">
        <input
          id="calendar-subscription-url"
          type="url"
          value={feedUrl}
          readOnly
          onFocus={(focusEvent) => focusEvent.target.select()}
        />
        <button type="button" onClick={copyFeedUrl}>Copy</button>
      </div>

      {copyStatus && <p className="calendar-subscription__status" role="status">{copyStatus}</p>}
      <p className="calendar-subscription__help">
        If Google does not add it directly, choose <strong>Other calendars</strong>, then
        <strong> From URL</strong> on a computer. In Outlook, choose <strong>Add calendar</strong>,
        then <strong>Subscribe from web</strong>. Refresh timing is controlled by each calendar provider.
      </p>
    </section>
  )
}

export default function Calendar() {
  const todayParts = useMemo(() => easternDateParts(), [])
  const [monthDate, setMonthDate] = useState(() => new Date(todayParts.year, todayParts.month - 1, 1))
  const [events, setEvents] = useState([])
  const [loadStatus, setLoadStatus] = useState('loading')
  const [loadError, setLoadError] = useState('')
  const [requestId, setRequestId] = useState(0)
  const [category, setCategory] = useState('All')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [allDay, setAllDay] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const [subscriptionOpen, setSubscriptionOpen] = useState(false)

  useEffect(() => {
    if (!subscriptionOpen) return undefined

    const animationFrame = window.requestAnimationFrame(() => {
      document.getElementById('calendar-subscription')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })

    return () => window.cancelAnimationFrame(animationFrame)
  }, [subscriptionOpen])

  const calendarDays = useMemo(() => getCalendarDays(monthDate), [monthDate])
  const visibleMonth = monthDate.getMonth()
  const todayKey = `${todayParts.year}-${String(todayParts.month).padStart(2, '0')}-${String(todayParts.day).padStart(2, '0')}`
  const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(monthDate)

  useEffect(() => {
    const controller = new AbortController()

    async function loadEvents() {
      if (!isCalendarConfigured) {
        setLoadStatus('error')
        setLoadError('The calendar connection has not been configured.')
        return
      }

      setLoadStatus('loading')
      setLoadError('')

      try {
        const firstDay = localDateKey(calendarDays[0])
        const lastDay = addDaysToDateInput(localDateKey(calendarDays.at(-1)), 1)
        const publishedEvents = await getPublishedEvents({
          rangeStart: zonedDateTimeToIso(firstDay),
          rangeEnd: zonedDateTimeToIso(lastDay),
          signal: controller.signal,
        })
        setEvents(publishedEvents)
        setLoadStatus('success')
      } catch (error) {
        if (error.name === 'AbortError') return
        setLoadStatus('error')
        setLoadError('We could not load community events right now. Please try again.')
      }
    }

    loadEvents()
    return () => controller.abort()
  }, [calendarDays, requestId])

  const filteredEvents = useMemo(
    () => events.filter((event) => category === 'All' || event.category === category),
    [category, events],
  )

  const visibleMonthEvents = useMemo(
    () => filteredEvents.filter((event) => {
      const eventDate = easternDateParts(new Date(event.start_at))
      return eventDate.year === monthDate.getFullYear() && eventDate.month === monthDate.getMonth() + 1
    }),
    [filteredEvents, monthDate],
  )

  const eventsByDate = useMemo(() => {
    const groupedEvents = new Map()
    filteredEvents.forEach((event) => {
      const key = dateKey(new Date(event.start_at))
      groupedEvents.set(key, [...(groupedEvents.get(key) ?? []), event])
    })
    return groupedEvents
  }, [filteredEvents])

  async function handleSubmit(submitEvent) {
    submitEvent.preventDefault()
    const form = submitEvent.currentTarget
    const formData = new FormData(form)
    const startDate = formData.get('startDate')
    const startTime = formData.get('startTime')
    const endDate = formData.get('endDate')
    const endTime = formData.get('endTime')

    if (!allDay && !startTime) {
      setSubmitStatus('error')
      setSubmitMessage('Enter an event start time.')
      return
    }

    if (!allDay && Boolean(endDate) !== Boolean(endTime)) {
      setSubmitStatus('error')
      setSubmitMessage('Enter both an end date and end time, or leave both blank.')
      return
    }

    const startAt = zonedDateTimeToIso(startDate, allDay ? '00:00' : startTime)
    let endAt = null

    if (allDay && endDate) {
      endAt = zonedDateTimeToIso(addDaysToDateInput(endDate, 1), '00:00')
    } else if (!allDay && endDate && endTime) {
      endAt = zonedDateTimeToIso(endDate, endTime)
    }

    if (endAt && new Date(endAt) <= new Date(startAt)) {
      setSubmitStatus('error')
      setSubmitMessage('The event end must be after its start.')
      return
    }

    setSubmitStatus('submitting')
    setSubmitMessage('')

    try {
      await submitCalendarEvent({
        title: formData.get('title'),
        description: formData.get('description'),
        startAt,
        endAt,
        allDay,
        locationName: formData.get('locationName'),
        address: formData.get('address'),
        websiteUrl: formData.get('websiteUrl'),
        category: formData.get('category'),
        submitterName: formData.get('submitterName'),
        submitterEmail: formData.get('submitterEmail'),
      })

      form.reset()
      setAllDay(false)
      setSubmitStatus('success')
      setSubmitMessage('Thank you! Your event was submitted successfully and will appear on the calendar after it is reviewed and approved.')
    } catch (error) {
      setSubmitStatus('error')
      setSubmitMessage(error.message || 'Your event could not be submitted. Please try again.')
    }
  }

  return (
    <>
      <section className="page-hero page-hero--calendar">
        <div className="page-hero__noise" aria-hidden="true" />
        <div className="page-hero__content calendar-hero__content">
          <div>
            <p className="hero__eyebrow">There&rsquo;s Always Something Happening</p>
            <h1 className="page-hero__headline">Lee County Community Calendar</h1>
            <p className="page-hero__lede">Find Appalachian festivals, live music, family fun, public meetings, and more for residents and visitors exploring rural Virginia.</p>
          </div>
          <div className="calendar-hero__actions">
            <button
              className="btn btn--ghost"
              type="button"
              aria-expanded={subscriptionOpen}
              aria-controls="calendar-subscription"
              disabled={!calendarFeedUrl}
              onClick={() => setSubscriptionOpen((open) => !open)}
            >
              {subscriptionOpen ? 'Close Subscription' : 'Subscribe to Calendar'}
            </button>
            <a className="btn btn--copper" href="#submit-an-event">Submit an Event</a>
          </div>
        </div>
      </section>

      <section className="calendar-section">
        <div className="calendar-section__inner">
          {subscriptionOpen && calendarFeedUrl && (
            <CalendarSubscription feedUrl={calendarFeedUrl} onClose={() => setSubscriptionOpen(false)} />
          )}

          <div className="calendar-intro">
            <div>
              <p className="section-label">Plan Something LoveLee</p>
              <h2 className="section-heading">What&rsquo;s happening around Lee County.</h2>
            </div>
            <p className="section-copy">Browse the month or filter by what interests you. Local events make community life easier to discover and give Lee County tourism a more authentic sense of place.</p>
          </div>

          <div className="calendar-filters" aria-label="Filter events by category">
            {['All', ...categories].map((categoryName) => (
              <button
                className={category === categoryName ? 'calendar-filter calendar-filter--active' : 'calendar-filter'}
                type="button"
                key={categoryName}
                aria-pressed={category === categoryName}
                onClick={() => setCategory(categoryName)}
              >
                {categoryName}
              </button>
            ))}
          </div>

          <div className="calendar-layout">
            <div className="calendar-board">
              <div className="calendar-board__toolbar">
                <div className="calendar-board__month-controls">
                  <button type="button" aria-label="Previous month" onClick={() => setMonthDate((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1))}>←</button>
                  <h3 aria-live="polite">{monthLabel}</h3>
                  <button type="button" aria-label="Next month" onClick={() => setMonthDate((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1))}>→</button>
                </div>
                <button className="calendar-board__today" type="button" onClick={() => setMonthDate(new Date(todayParts.year, todayParts.month - 1, 1))}>Today</button>
              </div>

              <div className="calendar-board__scroll">
                <div className="calendar-grid">
                  {weekDays.map((day) => <div className="calendar-grid__weekday" key={day}><span>{day.slice(0, 3)}</span></div>)}
                  {calendarDays.map((day) => {
                    const key = localDateKey(day)
                    const dayEvents = eventsByDate.get(key) ?? []
                    const isOutsideMonth = day.getMonth() !== visibleMonth
                    const isToday = key === todayKey

                    return (
                      <div className={`calendar-day${isOutsideMonth ? ' calendar-day--outside' : ''}${isToday ? ' calendar-day--today' : ''}`} key={key}>
                        <span className="calendar-day__number" aria-label={isToday ? `${day.getDate()}, today` : undefined}>{day.getDate()}</span>
                        <div className="calendar-day__events">
                          {dayEvents.slice(0, 3).map((event) => (
                            <button
                              className="calendar-day__event"
                              data-category={event.category}
                              type="button"
                              key={event.id}
                              aria-label={`View ${event.title}`}
                              onClick={() => setSelectedEvent(event)}
                            >
                              {event.title}
                            </button>
                          ))}
                          {dayEvents.length > 3 && <span className="calendar-day__more">+{dayEvents.length - 3} more</span>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <p className="calendar-board__mobile-hint">Colored dots mark event dates. Full event details are listed below the calendar.</p>

              {loadStatus === 'loading' && <div className="calendar-board__loading" role="status"><span className="directory-status__spinner" aria-hidden="true" />Loading events…</div>}
              {loadStatus === 'error' && (
                <div className="calendar-board__error" role="alert">
                  <p>{loadError}</p>
                  {isCalendarConfigured && <button className="btn btn--ghost" type="button" onClick={() => setRequestId((id) => id + 1)}>Try again</button>}
                </div>
              )}
            </div>

            <aside className="upcoming-panel" aria-labelledby="events-this-month-title">
              <p className="section-label">This Month</p>
              <h2 id="events-this-month-title">On the calendar</h2>
              {loadStatus === 'success' && visibleMonthEvents.length > 0 ? (
                <div className="upcoming-panel__list">
                  {visibleMonthEvents.slice(0, 8).map((event) => <UpcomingEvent event={event} key={event.id} onSelect={setSelectedEvent} />)}
                </div>
              ) : loadStatus === 'success' ? (
                <div className="upcoming-panel__empty">
                  <CalendarMarkIcon />
                  <p>No {category === 'All' ? '' : `${category.toLowerCase()} `}events are listed for this view yet.</p>
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </section>

      <section className="event-submit" id="submit-an-event">
        <div className="event-submit__inner">
          <div className="event-submit__heading">
            <p className="section-label">Share What&rsquo;s Happening</p>
            <h2 className="section-heading">Add your event.</h2>
            <p className="section-copy">Hosting something in Lee County? Send us the details for free. Your event will be reviewed before it appears publicly on the calendar.</p>
            <div className="event-submit__note">
              <CalendarMarkIcon />
              <p><strong>Good to know</strong><span>Submit each event once. We&rsquo;ll use your private contact details only if we have a question.</span></p>
            </div>
          </div>

          <form className="event-form" onSubmit={handleSubmit}>
            <div className="event-form__row">
              <div className="contact-form__field">
                <label htmlFor="event-title">Event title</label>
                <input id="event-title" name="title" type="text" maxLength="120" required />
              </div>
              <div className="contact-form__field">
                <label htmlFor="event-category">Category</label>
                <select id="event-category" name="category" defaultValue="" required>
                  <option value="" disabled>Choose a category…</option>
                  {categories.map((categoryName) => <option key={categoryName}>{categoryName}</option>)}
                </select>
              </div>
            </div>

            <div className="contact-form__field">
              <label htmlFor="event-description">Description <span>(optional)</span></label>
              <textarea id="event-description" name="description" rows="5" maxLength="4000" placeholder="Tell people what to expect, what to bring, and any cost to attend." />
            </div>

            <label className="event-form__all-day">
              <input name="allDay" type="checkbox" checked={allDay} onChange={(changeEvent) => setAllDay(changeEvent.target.checked)} />
              <span aria-hidden="true" />
              This is an all-day event
            </label>

            <div className="event-form__row event-form__row--date">
              <div className="contact-form__field">
                <label htmlFor="event-start-date">Start date</label>
                <input id="event-start-date" name="startDate" type="date" required />
              </div>
              {!allDay && (
                <div className="contact-form__field">
                  <label htmlFor="event-start-time">Start time</label>
                  <input id="event-start-time" name="startTime" type="time" required />
                </div>
              )}
              <div className="contact-form__field">
                <label htmlFor="event-end-date">End date <span>(optional)</span></label>
                <input id="event-end-date" name="endDate" type="date" />
              </div>
              {!allDay && (
                <div className="contact-form__field">
                  <label htmlFor="event-end-time">End time <span>(optional)</span></label>
                  <input id="event-end-time" name="endTime" type="time" />
                </div>
              )}
            </div>

            <div className="event-form__row">
              <div className="contact-form__field">
                <label htmlFor="event-location">Venue <span>(optional)</span></label>
                <input id="event-location" name="locationName" type="text" maxLength="160" placeholder="Venue or meeting place" />
              </div>
              <div className="contact-form__field">
                <label htmlFor="event-address">Address <span>(optional)</span></label>
                <input id="event-address" name="address" type="text" maxLength="240" autoComplete="street-address" />
              </div>
            </div>

            <div className="contact-form__field">
              <label htmlFor="event-website">Event website <span>(optional)</span></label>
              <input id="event-website" name="websiteUrl" type="url" maxLength="500" inputMode="url" placeholder="https://example.com/event" />
            </div>

            <fieldset className="event-form__contact">
              <legend>Your private contact details</legend>
              <div className="event-form__row">
                <div className="contact-form__field">
                  <label htmlFor="event-submitter-name">Your name</label>
                  <input id="event-submitter-name" name="submitterName" type="text" maxLength="140" autoComplete="name" required />
                </div>
                <div className="contact-form__field">
                  <label htmlFor="event-submitter-email">Your email</label>
                  <input id="event-submitter-email" name="submitterEmail" type="email" maxLength="254" autoComplete="email" required />
                </div>
              </div>
            </fieldset>

            <button className="btn btn--primary" type="submit" disabled={submitStatus === 'submitting' || !isCalendarConfigured}>
              {submitStatus === 'submitting' ? 'Submitting…' : 'Submit Event'}
            </button>
            {submitMessage && (
              <p className={`event-form__message event-form__message--${submitStatus}`} role={submitStatus === 'error' ? 'alert' : 'status'}>
                {submitMessage}
              </p>
            )}
            <p className="form-privacy-note">By submitting, you confirm these event details are accurate. See our <Link to="/privacy-policy/">Privacy Policy</Link> and <Link to="/terms/">Terms of Service</Link>.</p>
          </form>
        </div>
      </section>

      {selectedEvent && <EventDetails event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </>
  )
}
