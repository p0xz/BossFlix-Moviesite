import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const lastmod = new Date().toISOString();

	const sitemap: string = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset
            xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
        <!-- created with Free Online Sitemap Generator www.xml-sitemaps.com -->


        <url>
        <loc>https://bossflix.org/</loc>
        <lastmod>${lastmod}</lastmod>
        <priority>1.00</priority>
        </url>
        <url>
        <loc>https://bossflix.org/info</loc>
        <lastmod>2025-11-10T22:21:47+00:00</lastmod>
        <priority>0.80</priority>
        </url>
        <url>
        <loc>https://bossflix.org/movie</loc>
        <lastmod>${lastmod}</lastmod>
        <priority>0.80</priority>
        </url>
        <url>
        <loc>https://bossflix.org/series</loc>
        <lastmod>${lastmod}</lastmod>
        <priority>0.80</priority>
        </url>
        <url>
        <loc>https://bossflix.org/history</loc>
        <lastmod>${lastmod}</lastmod>
        <priority>0.80</priority>
        </url>

        </urlset>
    `.trim();

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
		},
	});
};
