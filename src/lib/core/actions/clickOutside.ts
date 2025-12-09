import type { Attachment } from 'svelte/attachments';

/**
 * Attaches an event listener to detect clicks outside the specified element
 * @param callback The function to call when a click outside of the element is detected
 * @returns Returns cleanup function to remove the event listener
 */
export function clickOutsideOfNode(callback: () => void): Attachment {
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
