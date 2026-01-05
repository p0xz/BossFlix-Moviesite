import type { PageLoad } from './$types';
import { seriesStore } from '$lib/features/media/stores/series.store';

export const load = (async ({ params, url, fetch, depends }) => {
	depends(`series:app`);

	let season = Number(url.searchParams.get('season'));
	if (isNaN(season) || season < 1) season = 1;

	const seriesData = await seriesStore.getSeriesData(params.id, season, fetch);

	return {
		series: seriesData,
	};
}) satisfies PageLoad;
