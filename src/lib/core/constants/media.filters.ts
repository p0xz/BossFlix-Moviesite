export const GENRES_MAP = {
	drama: 'Drama',
	action: 'Action',
	comedy: 'Comedy',
	adventure: 'Adventure',
	thriller: 'Thriller',
	crime: 'Crime',
	fantasy: 'Fantasy',
	'sci-fi': 'Sci-Fi',
	horror: 'Horror',
	romance: 'Romance',
	mystery: 'Mystery',
	family: 'Family',
	biography: 'Biography',
	history: 'History',
	animation: 'Animation',
	documentary: 'Documentary',
	music: 'Music',
	war: 'War',
	western: 'Western',
	musical: 'Musical',
	sport: 'Sport',
	'film-noir': 'Film-Noir',
	short: 'Short',
	'reality-tv': 'Reality-TV',
	news: 'News',
	'talk-show': 'Talk-Show',
	'game-show': 'Game-Show',
} as const;

export const TITLE_TYPES_MAP = {
	movie: 'Movie',
	tvSeries: 'Series',
} as const;

// Types derived automatically from the maps
export type GenreKey = keyof typeof GENRES_MAP;
export type TitleKey = keyof typeof TITLE_TYPES_MAP;
