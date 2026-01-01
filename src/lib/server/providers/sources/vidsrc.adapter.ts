import { TorProxyGateway } from '$lib/server/proxy/proxyAgent';
import { decodeVidSrcHash } from '../decoders/vidsrc.decoder';
import { VidSrcAdapterError } from '../exceptions';

export class VidSrcAdapter {
	private static contentUrl = `https://cloudnestra.com`;

	private static regexes = {
		iframePlayer: /id="player_iframe".*?src="(.*?)"/,
		iframePlayer2: /id:*.'player_iframe',.*src:.*?'(.*?)'/s,
		hash: /<div\s+id="[^"]+"\s+style="display:none;">(.*?)<\/div>/,
	};

	private static SL_DOMAIN_PLACEHOLDERS = {
		v1: 'thrumbleandjaxon.com',
		v2: 'glimmerstacktwist.com',
		v3: 'glimmerstacktwist.com',
		v4: 'cloudnestra.com',
		v5: 'putgate.org',
	};

	private static decode_Rot13_Base64(input: string) {
		const reversed = input.split('').reverse().join('');
		const rot13 = reversed.replace(/[a-zA-Z]/g, (char: string) => {
			return String.fromCharCode(char.charCodeAt(0) + (char.toLowerCase() < 'n' ? 13 : -13));
		});
		const reversedAgain = rot13.split('').reverse().join('');
		return atob(reversedAgain);
	}

	/**
	 * Reverse -> Take every 2nd character -> Base64
	 */
	private static decode_Skip_Base64(input: string) {
		const reversed = input.split('').reverse().join('');
		let skipped = '';
		for (let i = 0; i < reversed.length; i += 2) {
			skipped += reversed[i];
		}
		return atob(skipped);
	}

	/**
	 * Reverse -> Hex Decode -> XOR
	 */
	private static decode_Hex_Xor(input: string) {
		const reversed = input.split('').reverse().join('');
		// Convert Hex string to characters
		const hexDecoded = reversed
			.match(/.{1,2}/g)
			?.map((byte) => String.fromCharCode(parseInt(byte, 16)))
			.join('');

		if (!hexDecoded) return '';

		let result = '';
		const key = 'X9a(O;FMV2-7VO5x;Ao:dN1NoFs?j,';

		for (let i = 0; i < hexDecoded.length; i++) {
			result += String.fromCharCode(hexDecoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
		}
		return result;
	}

	/**
	 * Reverse -> Shift Char -1 -> Hex Decode
	 */
	private static decode_Shifted_Hex(input: string) {
		const reversed = input.split('').reverse().join('');

		let correctedHex = '';
		for (let i = 0; i < reversed.length; i++) {
			correctedHex += String.fromCharCode(reversed.charCodeAt(i) - 1);
		}

		let result = '';
		for (let i = 0; i < correctedHex.length; i += 2) {
			result += String.fromCharCode(parseInt(correctedHex.substring(i, i + 2), 16));
		}

		return result;
	}

	/**
	 *  Slice (Remove 10 start, 16 end) -> Base64 -> XOR
	 */
	private static decode_Slice_Base64_Xor(input: string) {
		// CAUTION: This will fail if input is too short
		const sliced = input.slice(10, -16);
		const b64Decoded = atob(sliced);

		const keyPattern = '3SAY~#%Y(V%>5d/Yg"$G[Lh1rK4a;7ok';
		const fullKey = keyPattern.repeat(Math.ceil(b64Decoded.length / keyPattern.length)).substring(0, b64Decoded.length);

		let result = '';
		for (let i = 0; i < b64Decoded.length; i++) {
			result += String.fromCharCode(b64Decoded.charCodeAt(i) ^ fullKey.charCodeAt(i));
		}
		return result;
	}

	/**
	 *  Caesar Cipher (Shift +3)
	 */
	private static decode_Caesar_Shift3(input: string) {
		//  x->a, a->d (+3 shift)
		const map = {
			x: 'a',
			y: 'b',
			z: 'c',
			a: 'd',
			b: 'e',
			c: 'f',
			d: 'g',
			e: 'h',
			f: 'i',
			g: 'j',
			h: 'k',
			i: 'l',
			j: 'm',
			k: 'n',
			l: 'o',
			m: 'p',
			n: 'q',
			o: 'r',
			p: 's',
			q: 't',
			r: 'u',
			s: 'v',
			t: 'w',
			u: 'x',
			v: 'y',
			w: 'z',
			X: 'A',
			Y: 'B',
			Z: 'C',
			A: 'D',
			B: 'E',
			C: 'F',
			D: 'G',
			E: 'H',
			F: 'I',
			G: 'J',
			H: 'K',
			I: 'L',
			J: 'M',
			K: 'N',
			L: 'O',
			M: 'P',
			N: 'Q',
			O: 'R',
			P: 'S',
			Q: 'T',
			R: 'U',
			S: 'V',
			T: 'W',
			U: 'X',
			V: 'Y',
			W: 'Z',
		} as const;

		return input.replace(
			/[xyzabcdefghijklmnopqrstuvwXYZABCDEFGHIJKLMNOPQRSTUVW]/g,
			(char: string) => map[char as keyof typeof map],
		);
	}

	/**
	 * Reverse -> Fix URL Base64 -> Decode -> Shift by N
	 */
	public static decode_UrlB64_Shift(input: string, shiftAmount: number) {
		const reversed = input.split('').reverse().join('');
		const standardB64 = reversed.replace(/-/g, '+').replace(/_/g, '/');
		const decoded = atob(standardB64);

		let result = '';
		for (let i = 0; i < decoded.length; i++) {
			result += String.fromCharCode(decoded.charCodeAt(i) - shiftAmount);
		}
		return result;
	}

	private static decode_UrlB64_Shift_5(hash: string) {
		return VidSrcAdapter.decode_UrlB64_Shift(hash, 5);
	}
	private static decode_UrlB64_Shift_7(hash: string) {
		return VidSrcAdapter.decode_UrlB64_Shift(hash, 7);
	}
	private static decode_UrlB64_Shift_3(hash: string) {
		return VidSrcAdapter.decode_UrlB64_Shift(hash, 3);
	}

	private static decoder(hash: string) {
		const decoders = [
			this.decode_Rot13_Base64,
			this.decode_Skip_Base64,
			this.decode_Hex_Xor,
			this.decode_Shifted_Hex,
			this.decode_Slice_Base64_Xor,
			this.decode_Caesar_Shift3,
			this.decode_UrlB64_Shift_5,
			this.decode_UrlB64_Shift_7,
			this.decode_UrlB64_Shift_3,
		];

		const decodedValues = decoders.map((fn) => {
			try {
				return fn(hash.trim());
			} catch (error) {
				return null;
			}
		});
		const filteredValues = decodedValues.filter((result) => result?.includes('tmstr') && /https?:\/\//.test(result));

		if (filteredValues.length === 0) {
			console.log(hash, decodedValues);
		}

		return filteredValues;
	}

	public static async requestNativeVideoUrl(embedUrl: string): Promise<any> {
		const torFetch = await TorProxyGateway.fetch();

		const firstLayerHtml = await torFetch(embedUrl, {
			headers: {
				Referer: embedUrl,
			},
		});

		if (!firstLayerHtml.includes('player_iframe')) {
			throw new VidSrcAdapterError(`Failed to find 'player_iframe' in the first layer HTML`, { cause: embedUrl });
		}

		const contentUrlMatch = firstLayerHtml.match(this.regexes.iframePlayer)?.[1];

		if (!contentUrlMatch) {
			throw new VidSrcAdapterError(`Failed to extract content URL from 'player_iframe'`, { cause: embedUrl });
		}

		const secondLayerHtml = await torFetch(`https:` + contentUrlMatch);
		// console.log(secondLayerHtml);

		// if (secondLayerHtml.includes('/rcp_verify')) {
		// 	console.log(firstLayerHtml);
		// }

		const nestedIframeSource = secondLayerHtml.match(this.regexes.iframePlayer2)?.[1];

		if (!nestedIframeSource) {
			throw new VidSrcAdapterError(`Failed to extract nested iframe source URL`, { cause: embedUrl });
		}

		// console.log(`Final layer to fetch!`);

		const thirdLayerHtml = await torFetch(this.contentUrl + nestedIframeSource, {
			headers: {
				Referer: this.contentUrl + nestedIframeSource,
			},
		});
		const hashMatch = thirdLayerHtml.match(this.regexes.hash)?.[1];

		// console.log(hashMatch);

		if (!hashMatch) {
			throw new VidSrcAdapterError(`Failed to extract hash from the final layer HTML`, { cause: embedUrl });
		}

		const nativeVideoUrl = decodeVidSrcHash(hashMatch);

		if (!nativeVideoUrl?.length) {
			throw new VidSrcAdapterError(`Failed to decode native video URL from hash`, { cause: embedUrl });
		}

		return nativeVideoUrl?.[0]?.split(' or ')?.[0]?.replace(/{([a-z0-9]+)}/g, (match, key) => {
			return this.SL_DOMAIN_PLACEHOLDERS[key as keyof typeof VidSrcAdapter.SL_DOMAIN_PLACEHOLDERS] || match;
		});
	}
}
