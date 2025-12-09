export function isReleased(dates: { year?: number; month?: number; day?: number }) {
	if (!dates?.year || !dates?.month || !dates?.day) return false;

	const now = new Date();
	const releaseDate = new Date(dates?.year, dates?.month - 1, dates?.day);
	return releaseDate <= now;
}

export function isFreshRelease() {}
