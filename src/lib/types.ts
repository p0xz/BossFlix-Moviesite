export namespace Imdb {
    export interface Movie {
        ratingsSummary: {
            aggregateRating: number;
        };
        originalTitleText: {
            text: string;
        };
        releaseDate: {
            day: number;
            month: number;
            year: number;
        };
        titleGenres: {
            genres: {
                genre: {
                    text: string;
                };
            }[];
        };
        directors: {
            edges: {
                node: {
                    name: {
                        nameText: {
                            text: string;
                        };
                    };
                };
            }[];
        };
    }
}