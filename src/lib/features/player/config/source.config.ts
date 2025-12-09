export const SOURCE_ORIGINS = {
	vidsrc: 'https://vidsrc-embed.ru/embed/',
	superembed: 'https://multiembed.mov/directstream.php',
	vidstream: 'https://vidsrc.cc/v3/embed/',
	primewire: 'https://www.primewire.tf/embed/',
	moviestream: 'https://moviesapi.to/',
} as const;

export type SourceOrigin = keyof typeof SOURCE_ORIGINS;
