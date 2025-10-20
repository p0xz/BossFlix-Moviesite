import type { PageServerLoad } from './$types';
import type { Imdb } from '$lib';

export const load = (async ({ params }) => {

    const requestBody = {
        query: `
            query {
                title(id: "${params.id}") {
                    ratingsSummary {
                        aggregateRating
                    }
                    originalTitleText {
                        text
                    }
                    releaseDate {
                        day
                        month
                        year
                    }
                     titleGenres {
                        genres {
                            genre {
                            text
                            }
                        }
                    }
                    directors: credits(first: 5, filter: { categories: ["director"] }) {
                    edges {
                        node {
                        name {
                            nameText {
                            text
                            }
                        }
                        }
                    }
                    }
            }
        }`
    };

    const response = await fetch("https://caching.graphql.imdb.com/", {
        "headers": {
            "accept-language": "en-US,en;q=0.9,sk;q=0.8",
            "content-type": "application/json",
            "x-imdb-user-language": "en-US",
        },
        "body": JSON.stringify(requestBody),
        "method": "POST"
    }).then(res => res.json() as Promise<{ data: { title: Imdb.Movie } }>);

    // console.dir(response, { depth: Infinity });

    return {
        movie: response.data.title
    };
}) satisfies PageServerLoad;