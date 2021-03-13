function getDefaultOptions (THREE) {

	return {

		debugLevel: 0, // 0,1,2,3

		responsive: true,

		renderer: {
			type: 'WebGLRenderer',
			args: [{ antialias: true, preserveDrawingBuffer: true, alpha: true }],
			domElement: 'body',
			clearColor: '#000000',
			opacity: 1,
			properties: {
				// outputEncoding: THREE.sRGBEncoding,
				shadowMap: {
					enabled: true,
					type: THREE.PCFSoftShadowMap
				}
			}
		},

		camera: {
			type: 'PerspectiveCamera',
			methods: {
				lookAt: [0, 0, 0]
			},
			properties: {
				position: { x: -1, y: 2, z: 5 },
				name: 'camera-1',
				fov: 35,
				aspect: window.innerWidth / window.innerHeight,
				near: 1,
				far: 300
			}
		},

		scene: {
			type: 'Scene',
			properties: {
				name: 'scene-1',
				position: { x: 0, y: 0, z: 0 }
			}
		}

	};

}

export { getDefaultOptions };
