// place files you want to import through the `$lib` alias in this folder.
export { debounce, arraysEqual, truncate, fixDigits, outsideClick, formatRuntime } from './utils';
export { queries } from './client-queries';
export { watchedStore } from './state.svelte';
export type { Imdb } from './types/types';

export const IMDB_API_URL = `https://caching.graphql.imdb.com/`;
