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

export function preventNonDigitInput(event: KeyboardEvent) {
	if (!event.ctrlKey && !event.metaKey && event.key.length === 1 && !/[0-9]/.test(event.key)) {
		event.preventDefault();
	}
}
