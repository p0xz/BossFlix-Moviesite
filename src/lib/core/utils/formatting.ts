export function truncate(value: string, threshold: number) {
	const sugar = value.length > threshold ? '...' : '';
	return value.slice(0, threshold).trim() + sugar;
}

export function capitalize(value: string) {
	return String(value).charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function fixDigits(number: number, digits: number = 2, preverse: boolean = false): string {
	if (number.toString().length >= digits && preverse) return number.toString();
	let zeros: string = '';
	for (let i = 0; i < digits; i++) zeros += '0';
	return (zeros + number).slice(-digits);
}
