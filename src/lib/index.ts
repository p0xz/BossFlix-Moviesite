// place files you want to import through the `$lib` alias in this folder.
export { debounce, arraysEqual, truncate, fixDigits, outsideClick, formatRuntime, isReleased, capitalize } from './utils/global';
export { REQUIRED_LENGTH_TO_SUBMIT } from './utils/constants';
export { SourceBuilder } from './utils/sources';
export { gq } from './client-queries';
export { watchedStore } from './stores/history.svelte';

export const IMDB_API_URL = `https://caching.graphql.imdb.com/`;
