import net from 'net';
import { TOR_CONTROL_PORT, TOR_ROTATION_THRESHOLD } from './config';
import { TOR_PASSWORD } from '$env/static/private';

/**
 * Rotates the Tor identity by sending a SIGNAL NEWNYM command to the Tor control port
 */
export function rotateTorCircuit() {
	return new Promise((resolve, reject) => {
		const client = net.createConnection({ port: TOR_CONTROL_PORT, host: '127.0.0.1' }, () => {
			console.log(`\n[Tor] 🔄 Limit hit (${TOR_ROTATION_THRESHOLD} reqs). Rotating IP...`);
			client.write(`AUTHENTICATE "${TOR_PASSWORD}"\r\n`);
			client.write('SIGNAL NEWNYM\r\n');
		});

		client.on('data', (data) => {
			const response = data.toString();
			if (response.includes('250 OK')) {
				console.log('[Tor] ✅ IP Rotated. Waiting 3s for circuit...');
				client.end();

				setTimeout(resolve, 3000);
			} else if (response.includes('515 Authentication required')) {
				// console.error("[Tor] ❌ Auth Failed. Check password.");
				client.end();
				reject(new Error('Tor Auth Failed'));
			}
		});

		client.on('error', (err) => {
			reject(err);
		});
	});
}
