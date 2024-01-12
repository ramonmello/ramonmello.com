import type { Handle } from '@sveltejs/kit';
import { sourceLanguageTag } from '$paraglide/runtime';

const preload_types = ['js', 'css', 'font'];

export const handle: Handle = async ({ event, resolve }) => {
	const lang = event.params.lang ?? sourceLanguageTag;

	return await resolve(event, {
		transformPageChunk({ done, html }) {
			//Only do it at the very end of the rendering process
			if (done) {
				return html.replace('%lang%', lang);
			}
		},
		preload: ({ type }) => preload_types.includes(type)
	});
};
