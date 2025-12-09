/**
 * Formats a duration given in seconds into a human-readable format or better say more pleasing to the eye
 * @param seconds The time provided in seconds
 * @returns Returns string formatted as e.g. "1h 30m"
 */
export function formatRuntime(seconds: number) {
	return new Intl.DurationFormat('en', { style: 'narrow' }).format({
		hours: Math.floor(seconds / 3600),
		minutes: Math.floor((seconds % 3600) / 60),
	});
}

export function getLastWeekDateISO(): string {
	const date = new Date();
	date.setDate(date.getDate() - 7);
	return date.toISOString().split('T')[0];
}
