const UNITS = [
  { limit: 60, divisor: 1, unit: "second" },
  { limit: 3600, divisor: 60, unit: "minute" },
  { limit: 86400, divisor: 3600, unit: "hour" },
  { limit: 604800, divisor: 86400, unit: "day" },
  { limit: 2629800, divisor: 604800, unit: "week" },
  { limit: 31557600, divisor: 2629800, unit: "month" },
  { limit: Infinity, divisor: 31557600, unit: "year" },
];

const formatter = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });

export function timeAgo(isoDate) {
  const seconds = (Date.now() - new Date(isoDate).getTime()) / 1000;
  if (seconds < 5) return "just now";
  const { divisor, unit } = UNITS.find(({ limit }) => seconds < limit);
  return formatter.format(-Math.round(seconds / divisor), unit);
}
