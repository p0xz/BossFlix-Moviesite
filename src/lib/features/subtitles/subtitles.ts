export class SubtitleBuilder {
	/**
	 * @param language Must be an ISO 693-2
	 */
	static getOrigin(imdbId: string, season: number, episode: number, language: string = 'eng') {
		imdbId = imdbId.slice(2);

		return `https://rest.opensubtitles.org/search/episode-${episode}/${imdbId}-0096697/season-${season}/sublanguageid-${language}`;
	}
}
