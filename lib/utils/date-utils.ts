/**
 * Date Utilities
 *
 * Shared date helpers used across form components.
 */

/**
 * Returns today's date as a Date object with time zeroed out.
 * Used as the minimum selectable date in date pickers.
 */
export function minDate(): Date {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

/**
 * Formats a date string to UK locale display format.
 */
export function formatDateUK(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
