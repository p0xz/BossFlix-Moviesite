import type { Attachment } from 'svelte/attachments';

export function debounce<F extends (...args: any[]) => void>(func: F, waitFor: number) {
	let timeout: ReturnType<typeof setTimeout>;

	return (...args: Parameters<F>): void => {
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(() => func(...args), waitFor);
	};
}

export function arraysEqual<T>(
	a: T[] = [],
	b: T[] = [],
	comparator: (a: T, b: T, indexA: number, indexB: number) => boolean,
): boolean {
	if (a === b) return true;
	if (!a || !b) return false;
	if (a.length !== b.length) return false;

	for (let i = 0; i < a.length; i++) {
		if (!comparator(a[i], b[i], i, i)) {
			return false;
		}
	}

	return true;
}

export function truncate(value: string, threshold: number) {
	const sugar = value.length > threshold ? '...' : '';
	return value.slice(0, threshold).trim() + sugar;
}

export function fixDigits(number: number, digits: number = 2, preverse: boolean = false): string {
	if (number.toString().length >= digits && preverse) return number.toString();
	let zeros = '';
	for (let i = 0; i < digits; i++) zeros += '0';
	return (zeros + number).slice(-digits);
}

export function outsideClick(callback: () => void): Attachment {
	return (element) => {
		function handleClick(event: MouseEvent) {
			if (!element.contains(event.target as Node)) {
				callback();
			}
		}

		document.addEventListener('click', handleClick);

		return () => {
			document.removeEventListener('click', handleClick);
		};
	};
}

export function formatRuntime(seconds: number) {
	return new Intl.DurationFormat('en', { style: 'narrow' }).format({
		hours: Math.floor(seconds / 3600),
		minutes: Math.floor((seconds % 3600) / 60),
	});
}

export function isReleased(dates: { year: number; month: number; day: number }) {
	const now = new Date();
	const releaseDate = new Date(dates?.year, dates?.month - 1, dates?.day);
	return releaseDate <= now;
}

export function capitalize(value: string) {
	return String(value).charAt(0).toUpperCase() + value.slice(1);
}
