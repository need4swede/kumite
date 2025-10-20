Write a function that parses a natural language time duration string and converts it to total seconds.

The function should handle the following time units:
- seconds (s, sec, secs, second, seconds)
- minutes (m, min, mins, minute, minutes)
- hours (h, hr, hrs, hour, hours)
- days (d, day, days)

The input can contain multiple units separated by spaces or commas, such as:
- "2 hours 30 minutes"
- "1 day, 3 hours, 15 mins"
- "45 seconds"
- "2h 30m 15s"

The function should be case-insensitive and handle both abbreviated and full unit names.

## Input

Input will be a string describing a time duration, e.g., `"2 hours 30 minutes"`.

## Output

Output should be a number representing the total number of seconds, e.g., `9000`.

If the input is invalid or empty, return `0`.
