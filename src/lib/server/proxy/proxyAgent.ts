import type { Agent } from 'http';
import type { Dispatcher } from 'undici-types';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { TOR_PROXY_URL } from './tor/config';
import { rotateTorCircuit } from './tor/circuitRotator';
import { TorProxyError } from './tor/exceptions';

export interface ProxyRequestInit extends RequestInit {
	agent?: Agent;
	dispatcher?: Dispatcher;
}

const torAgent = new SocksProxyAgent(TOR_PROXY_URL);

export class TorProxyGateway {
	private static USER_AGENTS = [
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0',
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15',
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
		'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
	] as const;

	private static getRandomUA() {
		return this.USER_AGENTS[Math.floor(Math.random() * this.USER_AGENTS.length)];
	}

	private constructor() {}

	/**
	 * This fetch is sufficient for `3` consequtive requests via Tor with circuit rotation for bypassing Cloudflare limitations on vidsrc
	 * After that, further requests may not work since it will hit limitation, i.e., Cloudflare captcha or block
	 */
	public static async fetch() {
		await rotateTorCircuit();

		return async (url: string, options: ProxyRequestInit = {}) => {
			try {
				const _html = await fetch(url, {
					headers: {
						accept: 'application/html,application/xhtml+xml,application/xml',
						'User-Agent': this.getRandomUA(),
					},
					agent: torAgent,
					method: 'GET',
					...options,
				} as ProxyRequestInit).then((res) => res.text());

				// console.log(_html);

				return _html;
			} catch (error) {
				// @ts-ignore
				throw new TorProxyError(`Failed to fetch via Tor proxy (${error?.message})`, { cause: error });
			}
		};
	}
}

// export const torProxyGateway = new TorProxyGateway();
