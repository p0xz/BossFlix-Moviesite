import FilmTape_Linear from './Linear/Audiovisual/FilmTape.svelte';
import Info_Duotone from './Duotone/Alerts/Info.svelte';
import Info_Linear from './Linear/Alerts/Info.svelte';
import ArrowUp_Linear from './Linear/Arrows/ArrowTop.svelte';

export const Icon = {
	Linear: {
		FilmTape: FilmTape_Linear,
		Info: Info_Linear,
		ArrowUp: ArrowUp_Linear
	},
	Duotone: {
		Info: Info_Duotone
	},
	Filled: {}
} as const;

export type IconLinearName = keyof typeof Icon.Linear;
export type IconFilledName = keyof typeof Icon.Filled;
