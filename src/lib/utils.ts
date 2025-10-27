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
	comparator: (a: T, b: T, indexA: number, indexB: number) => boolean
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

export function toBoolean(value: boolean | string | undefined): boolean {
	return value == 'true';
}

export function truncate(value: string, threshold: number) {
	return value.slice(0, threshold);
}

export function hasNestedArray(array: any[]) {
	return array.every((a) => Array.isArray(a));
}

export function fixDigits(number: number, digits: number = 2, preverse: boolean = false): string {
	if (number.toString().length >= digits && preverse) return number.toString();
	let zeros = '';
	for (let i = 0; i < digits; i++) zeros += '0';
	return (zeros + number).slice(-digits);
}

export function clickOutside(node: HTMLElement, callback: () => void) {
	function handleClick(event: MouseEvent) {
		if (!node.contains(event.target as Node)) {
			callback();
		}
	}

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}
