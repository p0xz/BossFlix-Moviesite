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
