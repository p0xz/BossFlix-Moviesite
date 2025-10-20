import type { imdbSearch } from '$lib/server/types';
import type { PageServerLoad, Actions } from './$types';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ request }) => {
        const { media } = Object.fromEntries((await request.formData()).entries()) as Record<string, string>;

        if (!media || media.trim().length === 0) {
            return { search: [] };
        }

        const url = `https://v3.sg.media-imdb.com/suggestion/x/${encodeURIComponent(media)}.json`;

        const response = await fetch(url).then(res => res.json() as Promise<imdbSearch.Root>);
        // console.log(response);

        response.d = response.d.filter((item) => {
            return item.l.toLowerCase().includes(media.toLowerCase()) && (item.qid === 'movie' || item.qid === 'tvSeries');
        });

        const search = response.d.map(item => {
            return {
                id: item.id,
                title: item.l,
                rank: item.rank,
                imageUrl: item?.i?.imageUrl,
                type: item.qid === 'movie' ? 'movie' : item.qid === 'tvSeries' ? 'series' : 'unknown',
                release: item.y,
            }
        }) || [];
        // console.log(`[BossFlix] Searched for "${media}" and found ${search.length} results.`);

        return { search };
    },
} satisfies Actions;