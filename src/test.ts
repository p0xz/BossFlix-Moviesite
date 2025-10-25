(async () => {
	const response = await fetch('https://vidsrc-embed.ru/embed/tv/tt0096697');
	console.log(response);
})();

let data = [
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'prehls', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'volume', time: 0, data: 0.8, volume: 0.8 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			type: 'PLAYER_EVENT',
			data: {
				imdbId: 'tt0096697',
				tmdbId: 456,
				type: 'tv',
				season: 1,
				episode: 1,
				currentTime: 1375,
				duration: 0,
				event: 'timeupdate'
			}
		}
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 0, data: 0, duration: 1395.031631 }
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'init', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'inited', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'start', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'started', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'new', time: 0 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			type: 'PLAYER_EVENT',
			data: {
				imdbId: 'tt0096697',
				tmdbId: 456,
				type: 'tv',
				season: 1,
				episode: 1,
				currentTime: 1375,
				duration: 0,
				event: 'play'
			}
		}
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'play', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'resumed', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'buffering', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'waiting', time: 0 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			type: 'PLAYER_EVENT',
			data: {
				imdbId: 'tt0096697',
				tmdbId: 456,
				type: 'tv',
				season: 1,
				episode: 1,
				currentTime: 1375,
				duration: 1395,
				event: 'timeupdate'
			}
		}
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'duration', time: 0, data: 1395.019000000007, duration: 1395.019000000007 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'duration', time: 0, data: 1395.019000000007, duration: 1395.019000000007 }
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'waiting', time: 1375.593891 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'duration', time: 1375.593891, data: 1395.031631, duration: 1395.031631 }
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'buffered', time: 1375.593891 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1375.593891, data: 1375.593891, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			type: 'PLAYER_EVENT',
			data: {
				imdbId: 'tt0096697',
				tmdbId: 456,
				type: 'tv',
				season: 1,
				episode: 1,
				currentTime: 1375,
				duration: 1395,
				event: 'seeked'
			}
		}
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'seek', time: 1375.593891232583, data: 1375.593891 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'rewound', time: 1375.593891232583, data: 1375.593891 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			event: 'fragment',
			time: 1375.593891,
			data: 'https://mooncraftventures.xyz/content/a4d6c84b8d90191e9f4a490161fa714b/7e39f90815d0cbca3fcb1178fb9fa803/page-274.html'
		}
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'quartile', time: 1375.60807, data: '25%' } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'quartile', time: 1375.60807, data: '50%' } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'quartile', time: 1375.60807, data: '75%' } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1375.752459, data: 1375.752459, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1376.018646, data: 1376.018646, duration: 1395.031631 }
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'userpause', time: 1376.186981 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			type: 'PLAYER_EVENT',
			data: {
				imdbId: 'tt0096697',
				tmdbId: 456,
				type: 'tv',
				season: 1,
				episode: 1,
				currentTime: 1375,
				duration: 1395,
				event: 'pause'
			}
		}
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'pause', time: 1376.187073 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'paused', time: 1376.187073 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1376.187073, data: 1376.187073, duration: 1395.031631 }
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'userplay', time: 1376.187073 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			type: 'PLAYER_EVENT',
			data: {
				imdbId: 'tt0096697',
				tmdbId: 456,
				type: 'tv',
				season: 1,
				episode: 1,
				currentTime: 1375,
				duration: 1395,
				event: 'play'
			}
		}
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'play', time: 1376.276558 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'resumed', time: 1376.276558 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			event: 'fragment',
			time: 1376.405638,
			data: 'https://mooncraftventures.xyz/content/a4d6c84b8d90191e9f4a490161fa714b/7e39f90815d0cbca3fcb1178fb9fa803/page-275.html'
		}
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			type: 'PLAYER_EVENT',
			data: {
				imdbId: 'tt0096697',
				tmdbId: 456,
				type: 'tv',
				season: 1,
				episode: 1,
				currentTime: 1376,
				duration: 1395,
				event: 'timeupdate'
			}
		}
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1376.459054, data: 1376.459054, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1376.72627, data: 1376.72627, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1376.993348, data: 1376.993348, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1377.26047, data: 1377.26047, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1377.515233, data: 1377.515233, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1377.78191, data: 1377.78191, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1378.048798, data: 1378.048798, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1378.315504, data: 1378.315504, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'line', time: 1378.470635, data: 1389.050787994641 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'userseek', time: 1389.050787, data: 1389.050787994641 }
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'buffering', time: 1389.050787 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'waiting', time: 1389.050787 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'buffered', time: 1389.050787 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1389.050787, data: 1389.050787, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			type: 'PLAYER_EVENT',
			data: {
				imdbId: 'tt0096697',
				tmdbId: 456,
				type: 'tv',
				season: 1,
				episode: 1,
				currentTime: 1389,
				duration: 1395,
				event: 'seeked'
			}
		}
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'seek', time: 1389.050787994641, data: 1389.050787 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'rewound', time: 1389.050787994641, data: 1389.050787 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			event: 'fragment',
			time: 1389.050787,
			data: 'https://mooncraftventures.xyz/content/a4d6c84b8d90191e9f4a490161fa714b/7e39f90815d0cbca3fcb1178fb9fa803/page-277.html'
		}
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1389.212298, data: 1389.212298, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1389.478616, data: 1389.478616, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1389.745024, data: 1389.745024, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1390.0113, data: 1390.0113, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1390.277746, data: 1390.277746, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1390.544076, data: 1390.544076, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1390.808335, data: 1390.808335, duration: 1395.031631 }
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'ui', time: 1390.822987, data: 0 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1391.074616, data: 1391.074616, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1391.340846, data: 1391.340846, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			event: 'fragment',
			time: 1391.46614,
			data: 'https://mooncraftventures.xyz/content/a4d6c84b8d90191e9f4a490161fa714b/7e39f90815d0cbca3fcb1178fb9fa803/page-278.html'
		}
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1391.607142, data: 1391.607142, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1391.87332, data: 1391.87332, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			type: 'PLAYER_EVENT',
			data: {
				imdbId: 'tt0096697',
				tmdbId: 456,
				type: 'tv',
				season: 1,
				episode: 1,
				currentTime: 1392,
				duration: 1395,
				event: 'timeupdate'
			}
		}
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1392.139655, data: 1392.139655, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1392.400561, data: 1392.400561, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1392.666637, data: 1392.666637, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1392.932738, data: 1392.932738, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1393.198849, data: 1393.198849, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1393.465604, data: 1393.465604, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1393.723502, data: 1393.723502, duration: 1395.031631 }
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'ui', time: 1393.960501, data: 1 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1393.995721, data: 1393.995721, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1394.255196, data: 1394.255196, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1394.521076, data: 1394.521076, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1394.787925, data: 1394.787925, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1395.031631, data: 1395.031631, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			type: 'PLAYER_EVENT',
			data: {
				imdbId: 'tt0096697',
				tmdbId: 456,
				type: 'tv',
				season: 1,
				episode: 1,
				currentTime: 1392,
				duration: 1395,
				event: 'pause'
			}
		}
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'pause', time: 1395.031631 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'paused', time: 1395.031631 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'fileend', time: 1395.031631 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'quartile', time: 1395.031631, data: '100%' }
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'finish', time: 0 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			type: 'PLAYER_EVENT',
			data: {
				imdbId: 'tt0096697',
				tmdbId: 456,
				type: 'tv',
				season: 1,
				episode: 1,
				currentTime: 1395,
				duration: 1395,
				event: 'ended'
			}
		}
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'end', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'ended', time: 0 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			event: 'fragment',
			time: 0,
			data: 'https://mooncraftventures.xyz/content/a4d6c84b8d90191e9f4a490161fa714b/7e39f90815d0cbca3fcb1178fb9fa803/page-0.html'
		}
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 0, data: 0, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			type: 'PLAYER_EVENT',
			data: {
				imdbId: 'tt0096697',
				tmdbId: 456,
				type: 'tv',
				season: 1,
				episode: 1,
				currentTime: 0,
				duration: 1395,
				event: 'seeked'
			}
		}
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'seek', time: 0, data: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'rewound', time: 0, data: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'prehls', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'volume', time: 0, data: 0.8, volume: 0.8 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			type: 'PLAYER_EVENT',
			data: {
				imdbId: 'tt0096697',
				tmdbId: 456,
				type: 'tv',
				season: 1,
				episode: 2,
				currentTime: 0,
				duration: 0,
				event: 'timeupdate'
			}
		}
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'time', time: 0, data: 0, duration: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'init', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'inited', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'start', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'started', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'new', time: 0 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			type: 'PLAYER_EVENT',
			data: {
				imdbId: 'tt0096697',
				tmdbId: 456,
				type: 'tv',
				season: 1,
				episode: 2,
				currentTime: 0,
				duration: 0,
				event: 'play'
			}
		}
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'play', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'resumed', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'buffering', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'waiting', time: 0 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			type: 'PLAYER_EVENT',
			data: {
				imdbId: 'tt0096697',
				tmdbId: 456,
				type: 'tv',
				season: 1,
				episode: 2,
				currentTime: 0,
				duration: 1391,
				event: 'timeupdate'
			}
		}
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'duration', time: 0, data: 1391.098000000007, duration: 1391.098000000007 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'duration', time: 0, data: 1391.098000000007, duration: 1391.098000000007 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			event: 'fragment',
			time: 0,
			data: 'https://thrivewavecollective.xyz/content/ac6215003bb2336541801362b49e328f/7e39f90815d0cbca3fcb1178fb9fa803/page-0.html'
		}
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'buffered', time: 0.164008 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 0.164008, data: 0.164008, duration: 1391.098000000007 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 0.428439, data: 0.428439, duration: 1391.098000000007 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 0.690563, data: 0.690563, duration: 1391.098000000007 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 0.954745, data: 0.954745, duration: 1391.098000000007 }
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'userpause', time: 1.1364 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			type: 'PLAYER_EVENT',
			data: {
				imdbId: 'tt0096697',
				tmdbId: 456,
				type: 'tv',
				season: 1,
				episode: 2,
				currentTime: 0,
				duration: 1391,
				event: 'pause'
			}
		}
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'pause', time: 1.136504 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'paused', time: 1.136504 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1.136504, data: 1.136504, duration: 1391.098000000007 }
	}
];

let data2 = [
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'prehls', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'volume', time: 0, data: 0.8, volume: 0.8 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			type: 'PLAYER_EVENT',
			data: {
				imdbId: 'tt0096697',
				tmdbId: 456,
				type: 'tv',
				season: 1,
				episode: 1,
				currentTime: 1392,
				duration: 0,
				event: 'timeupdate'
			}
		}
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 0, data: 0, duration: 1395.019000000007 }
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'init', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'inited', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'start', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'started', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'new', time: 0 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			type: 'PLAYER_EVENT',
			data: {
				imdbId: 'tt0096697',
				tmdbId: 456,
				type: 'tv',
				season: 1,
				episode: 1,
				currentTime: 1392,
				duration: 0,
				event: 'play'
			}
		}
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'play', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'resumed', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'buffering', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'waiting', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'ui', time: 0, data: 0 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			type: 'PLAYER_EVENT',
			data: {
				imdbId: 'tt0096697',
				tmdbId: 456,
				type: 'tv',
				season: 1,
				episode: 1,
				currentTime: 1392,
				duration: 1395,
				event: 'timeupdate'
			}
		}
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'duration', time: 0, data: 1395.019000000007, duration: 1395.019000000007 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'duration', time: 0, data: 1395.019000000007, duration: 1395.019000000007 }
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'waiting', time: 1392.028605 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'duration', time: 1392.028605, data: 1395.031631, duration: 1395.031631 }
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'buffered', time: 1392.028605 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1392.028605, data: 1392.028605, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			type: 'PLAYER_EVENT',
			data: {
				imdbId: 'tt0096697',
				tmdbId: 456,
				type: 'tv',
				season: 1,
				episode: 1,
				currentTime: 1392,
				duration: 1395,
				event: 'seeked'
			}
		}
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'seek', time: 1392.0286055734261, data: 1392.028605 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'rewound', time: 1392.0286055734261, data: 1392.028605 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			event: 'fragment',
			time: 1392.028605,
			data: 'https://mooncraftventures.xyz/content/a4d6c84b8d90191e9f4a490161fa714b/7e39f90815d0cbca3fcb1178fb9fa803/page-278.html'
		}
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'quartile', time: 1392.070969, data: '25%' }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'quartile', time: 1392.070969, data: '50%' }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'quartile', time: 1392.070969, data: '75%' }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1392.205037, data: 1392.205037, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1392.470511, data: 1392.470511, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1392.733031, data: 1392.733031, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1392.997919, data: 1392.997919, duration: 1395.031631 }
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'ui', time: 1393.168719, data: 1 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1393.257894, data: 1393.257894, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1393.52051, data: 1393.52051, duration: 1395.031631 }
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'ui', time: 1393.661668, data: 0 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1393.791842, data: 1393.791842, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1394.050718, data: 1394.050718, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1394.311577, data: 1394.311577, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1394.570606, data: 1394.570606, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1394.833723, data: 1394.833723, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1395.031631, data: 1395.031631, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1395.031631, data: 1395.031631, duration: 1395.031631 }
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'ui', time: 1395.031631, data: 1 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			type: 'PLAYER_EVENT',
			data: {
				imdbId: 'tt0096697',
				tmdbId: 456,
				type: 'tv',
				season: 1,
				episode: 1,
				currentTime: 1392,
				duration: 1395,
				event: 'pause'
			}
		}
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'pause', time: 1395.031631 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'paused', time: 1395.031631 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'fileend', time: 1395.031631 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'quartile', time: 1395.031631, data: '100%' }
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'finish', time: 0 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			type: 'PLAYER_EVENT',
			data: {
				imdbId: 'tt0096697',
				tmdbId: 456,
				type: 'tv',
				season: 1,
				episode: 1,
				currentTime: 1395,
				duration: 1395,
				event: 'ended'
			}
		}
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'end', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'ended', time: 0 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			event: 'fragment',
			time: 0,
			data: 'https://mooncraftventures.xyz/content/a4d6c84b8d90191e9f4a490161fa714b/7e39f90815d0cbca3fcb1178fb9fa803/page-0.html'
		}
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 0, data: 0, duration: 1395.031631 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			type: 'PLAYER_EVENT',
			data: {
				imdbId: 'tt0096697',
				tmdbId: 456,
				type: 'tv',
				season: 1,
				episode: 1,
				currentTime: 0,
				duration: 1395,
				event: 'seeked'
			}
		}
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'seek', time: 0, data: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'rewound', time: 0, data: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'prehls', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'volume', time: 0, data: 0.8, volume: 0.8 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			type: 'PLAYER_EVENT',
			data: {
				imdbId: 'tt0096697',
				tmdbId: 456,
				type: 'tv',
				season: 1,
				episode: 2,
				currentTime: 1,
				duration: 0,
				event: 'timeupdate'
			}
		}
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 0, data: 0, duration: 1391.098000000007 }
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'init', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'inited', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'start', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'started', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'new', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'ui', time: 0, data: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'mute', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'muted', time: 0 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			type: 'PLAYER_EVENT',
			data: {
				imdbId: 'tt0096697',
				tmdbId: 456,
				type: 'tv',
				season: 1,
				episode: 2,
				currentTime: 1,
				duration: 0,
				event: 'play'
			}
		}
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'play', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'resumed', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'buffering', time: 0 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'waiting', time: 0 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			type: 'PLAYER_EVENT',
			data: {
				imdbId: 'tt0096697',
				tmdbId: 456,
				type: 'tv',
				season: 1,
				episode: 2,
				currentTime: 1,
				duration: 1391,
				event: 'timeupdate'
			}
		}
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'duration', time: 0, data: 1391.098000000007, duration: 1391.098000000007 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'duration', time: 0, data: 1391.098000000007, duration: 1391.098000000007 }
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'waiting', time: 1.116466 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'buffered', time: 1.116466 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1.116466, data: 1.116466, duration: 1391.098000000007 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			type: 'PLAYER_EVENT',
			data: {
				imdbId: 'tt0096697',
				tmdbId: 456,
				type: 'tv',
				season: 1,
				episode: 2,
				currentTime: 1,
				duration: 1391,
				event: 'seeked'
			}
		}
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'seek', time: 1.116466, data: 1.116466 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'rewound', time: 1.116466, data: 1.116466 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			event: 'fragment',
			time: 1.117321,
			data: 'https://thrivewavecollective.xyz/content/ac6215003bb2336541801362b49e328f/7e39f90815d0cbca3fcb1178fb9fa803/page-0.html'
		}
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1.333641, data: 1.333641, duration: 1391.098000000007 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1.594331, data: 1.594331, duration: 1391.098000000007 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 1.8599, data: 1.8599, duration: 1391.098000000007 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 2.125533, data: 2.125533, duration: 1391.098000000007 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 2.391114, data: 2.391114, duration: 1391.098000000007 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 2.656765, data: 2.656765, duration: 1391.098000000007 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 2.922396, data: 2.922396, duration: 1391.098000000007 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 3.188039, data: 3.188039, duration: 1391.098000000007 }
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'ui', time: 3.448567, data: 1 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 3.460675, data: 3.460675, duration: 1391.098000000007 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 3.71927, data: 3.71927, duration: 1391.098000000007 }
	},
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 3.984883, data: 3.984883, duration: 1391.098000000007 }
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'userpause', time: 4.071161 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: {
			type: 'PLAYER_EVENT',
			data: {
				imdbId: 'tt0096697',
				tmdbId: 456,
				type: 'tv',
				season: 1,
				episode: 2,
				currentTime: 1,
				duration: 1391,
				event: 'pause'
			}
		}
	},
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'pause', time: 4.071204 } },
	{ origin: 'https://vidsrc-embed.ru', data: { event: 'paused', time: 4.071204 } },
	{
		origin: 'https://vidsrc-embed.ru',
		data: { event: 'time', time: 4.071204, data: 4.071204, duration: 1391.098000000007 }
	}
];
