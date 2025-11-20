import type { Attachment } from 'svelte/attachments';

/**
 * For the right usage there should be SSOF e.g.
 * ```ts
 * const debouncedFunction = debounce(() => {
 *   // Your logic here
 * }, 300);
 *
 * // Usage
 * debouncedFunction();
 * ```
 * so that multiple rapid calls to `debouncedFunction`will only result in a single execution after the specified delay.
 * @param func The function to debounce
 * @param waitFor The delay in milliseconds to wait before invoking the function
 * @returns A debounced version of the input function
 */
export function debounce<F extends (...args: any[]) => void>(func: F, waitFor: number) {
	let timeout: ReturnType<typeof setTimeout>;

	return (...args: Parameters<F>): void => {
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(() => func(...args), waitFor);
	};
}

export function arraysEqual<T>(a: T[] = [], b: T[] = [], comparator: (a: T, b: T, indexA: number, indexB: number) => boolean): boolean {
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
	let zeros: string = '';
	for (let i = 0; i < digits; i++) zeros += '0';
	return (zeros + number).slice(-digits);
}

/**
 * Attaches an event listener to detect clicks outside the specified element
 * @param callback The function to call when a click outside the element is detected
 * @returns Returns cleanup function to remove the event listener
 */
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

export function isReleased(dates: { year: number; month: number; day: number }) {
	const now = new Date();
	const releaseDate = new Date(dates?.year, dates?.month - 1, dates?.day);
	return releaseDate <= now;
}

export function capitalize(value: string) {
	return String(value).charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Replaces the end of an IMDb URL to request a resized image.
 * @param url The original URL from the API (e.g., ..._V1_.jpg)
 * @param width The target width in pixels
 */
export function getResizedImage(url: string | undefined, width = 400) {
	if (!url) return '';

	return url.replace('_V1_.jpg', `_V1_QL75_UX${width}_AL_.jpg`);
}

/**
 * Limits the number of characters that can be entered in an input field, e.g. on a number input since there's no native limitation.
 * @param event The event of the listener placed on input
 * @param maxLength The maximum length of characters allowed
 */
export function inputCharacterLimit(event: KeyboardEvent, maxLength: number) {
	if (event.ctrlKey || event.metaKey) return;

	const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
	if (allowedKeys.includes(event.key)) return;

	const input = event.currentTarget as HTMLInputElement;

	if (input.value.length >= maxLength) {
		event.preventDefault();
		event.stopPropagation();
	}
}

export function nonDigitInputPrevent(event: KeyboardEvent) {
	if (!event.ctrlKey && !event.metaKey && event.key.length === 1 && !/[0-9]/.test(event.key)) {
		event.preventDefault();
	}
}
