import { type PlayerMessageEmitter } from '$lib/types';

export function normalizePlayerInput() {}

export const isPlayerEvent = (v: unknown): v is PlayerMessageEmitter.PlayerJS.PlayerTypeEvent => {
	return !!v && typeof v === 'object' && 'type' in v && (v as any).type === 'PLAYER_EVENT' && 'data' in v;
};

// Player API wrapper

export function sendPlayerCommand<T extends PlayerMessageEmitter.PlayerJS.PlayerEventCommand>(
	targetWindow: Window | null | undefined,
	command: T,
	args?: PlayerMessageEmitter.PlayerJS.ArgumentForCommand<T>,
	targetOrigin: string = '*',
) {
	if (!targetWindow) {
		console.warn('[PlayerBridge] Attempted to send command to non-existent window');
		return;
	}

	targetWindow.postMessage({ api: command, set: args }, targetOrigin);
}
