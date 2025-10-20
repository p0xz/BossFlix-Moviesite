import FilmTape_Linear from './Linear/Audiovisual/FilmTape.svelte';

export const Icon = {
	Linear: {
		FilmTape: FilmTape_Linear,
	},
	Filled: {

	}
} as const;

export type IconLinearName = keyof typeof Icon.Linear;
export type IconFilledName = keyof typeof Icon.Filled;