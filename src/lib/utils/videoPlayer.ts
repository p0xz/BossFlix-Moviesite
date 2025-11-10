import { type PlayerMessageEmitter } from '$lib/types/types';

export function normalizePlayerInput() {}

export const isPlayerEvent = (v: unknown): v is PlayerMessageEmitter.PlayerJS.PlayerTypeEvent => {
	return (
		!!v &&
		typeof v === 'object' &&
		(<PlayerMessageEmitter.PlayerJS.PlayerTypeEvent>v).type === 'PLAYER_EVENT' &&
		!!(<PlayerMessageEmitter.PlayerJS.PlayerTypeEvent>v)?.data
	);
};

// Player API wrapper

export function playerJsMessageEmitter<T extends PlayerMessageEmitter.PlayerJS.PlayerEventCommand>(
	contentWindow: Window | null | undefined,
	cmd: T,
	arg: PlayerMessageEmitter.PlayerJS.ArgumentForCommand<T>,
	origin: string = '*',
) {
	contentWindow?.postMessage({ api: cmd, set: arg }, origin);
}
