// place files you want to import through the `$lib` alias in this folder.
export {
	debounce,
	arraysEqual,
	toBoolean,
	hasNestedArray,
	truncate,
	fixDigits,
	outsideClick
} from './utils';
export { queries } from './client-queries';
export type { Imdb } from './types';

export const IMDB_API_URL = `https://caching.graphql.imdb.com/`;
