module.exports = {
	listen: 10721,
	route: {
		'example.com': {
			'/': {
				type: 'static',
				target: 'static/example.com'
			},
			'/test': {
				type: 'proxy',
				target: 'http://localhost:10722'
			},
			'/api': {
				type: 'proxy',
				target: 'http://localhost:10723'
			},
		},
		'example.net': {
			'/': {
				type: 'static',
				target: 'static/example.net'
			},
			'/test': {
				type: 'proxy',
				target: 'http://localhost:10724'
			},
			'/api': {
				type: 'proxy',
				target: 'http://localhost:10725'
			},
		},
		'_any': {
			'/': {
				type: 'static',
				target: 'static/default'
			},
		},
	},
};
