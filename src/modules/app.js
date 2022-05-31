import { getDefaultOptions } from '../default.options';
import { Utils } from '../utils';

const App = (function () {

	let options = {};

	let THREE;

	const local = {

		canvas: null,
		camera: null,
		renderer: null,
		scene: null,
		mouse: null,
		raycaster: null,
		manager: null,
		controls: {
			OrbitControls: null
		},
		draggables: [],
		actions: {
			isDragging: false
		}

	};

	function init (three, initOptions = {}) {

		if (!three || !three.REVISION) {

			error('THREE is not inserted');

		}

		THREE = { ...three };

		if (!initOptions || typeof initOptions !== 'object') {

			initOptions = {};
			warn('Options are set to default values');

		}

		const mergedOptions = Utils.merge(getDefaultOptions(THREE), initOptions);

		options = { ...mergedOptions };

		local.renderer = initRenderer(options.renderer);

		local.manager = new THREE.LoadingManager();

	}

	function run (callback) {

		local.renderer.render(local.scene, local.camera);

		if (local.controls.OrbitControls) {

			if (local.controls.OrbitControls.enableDamping || local.controls.OrbitControls.autoRotate) {

				local.controls.OrbitControls.update();

			}

		}

		if (typeof callback === 'function') {

			callback();

		}

		requestAnimationFrame(() => run(callback));

	}

	function initSize () {

		const isResponsive = options.responsive || false;
		const initialFov = local.camera.fov;
		const initialWidth = local.canvas.clientWidth;

		let width = local.canvas.clientWidth;
		let height = local.canvas.clientHeight;

		local.renderer.setSize(width, height);
		local.camera.aspect = width / height;
		local.camera.updateProjectionMatrix();

		if (isResponsive === false) {

			return;

		}

		// TODO: refactor to resize observer
		window.addEventListener('resize', () => {

			const wWidth = window.innerWidth;

			width = local.canvas.clientWidth;
			height = local.canvas.clientHeight;

			if (wWidth !== width) {

				local.renderer.setSize(wWidth, height);

				local.camera.aspect = wWidth / height;
				local.camera.fov = initialFov * initialWidth / wWidth;
				local.camera.updateProjectionMatrix();

			}

		});

	}

	function initRenderer (o) {

		const domElement = document.querySelector(o.domElement);

		if (domElement instanceof HTMLCanvasElement) {

			o.args.canvas = domElement;
			local.canvas = domElement;

		}

		let renderer = createObject(o);

		renderer = applyRendererOptions(renderer, o.properties);

		renderer.setClearColor(new THREE.Color(o.clearColor), o.opacity);
		renderer.setPixelRatio(window.devicePixelRatio);

		if (!local.canvas) {

			domElement.appendChild(renderer.domElement);
			local.canvas = renderer.domElement;

		}

		renderer.setSize(local.canvas.clientWidth, local.canvas.clientHeight);

		return renderer;

	}

	function createObject (o) {

		const args = Array.isArray(o.args) ? o.args : [];
		const object = new THREE[o.type](...args);

		return object;

	}

	function applyRendererOptions (renderer, o) {

		return Utils.merge(renderer, o);

	}

	function logMessage (message, type) {

		// be chatty if no proper options are set
		const level = options.debugLevel !== undefined ? options.debugLevel : 3;

		switch (type) {

			case 'error':

				throw message;

			case 'warn':

				if (level > 0) {

					console.warn(message);

				}
				break;

			case 'info':

				if (level > 2) {

					console.info(message);

				}
				break;

			default:

				if (level > 1) {

					console.log(message);

				}
				break;

		}

	}

	function error (message) {

		logMessage(message, 'error');

	}

	function warn (message) {

		logMessage(message, 'warn');

	}

	function log (message) {

		logMessage(message, 'log');

	}

	function info (message) {

		logMessage(message, 'info');

	}

	return {

		get canvas () {

			return local.canvas;

		},

		get options () {

			return options;

		},

		get THREE () {

			return THREE;

		},

		get scene () {

			return local.scene;

		},

		set scene (object) {

			local.scene = object;

		},

		get camera () {

			return local.camera;

		},

		set camera (object) {

			local.camera = object;

		},

		get controls () {

			return local.controls;

		},

		get renderer () {

			return local.renderer;

		},

		get manager () {

			return local.manager;

		},

		get draggables () {

			return local.draggables;

		},

		get mouse () {

			return local.mouse;

		},

		set mouse (mouseVector2) {

			local.mouse = mouseVector2;

		},

		get raycaster () {

			return local.raycaster;

		},

		set raycaster (raycaster) {

			local.raycaster = raycaster;

		},

		get actions () {

			return local.actions;

		},

		initSize: initSize,
		create: createObject,
		error: error,
		warn: warn,
		log: log,
		info: info,
		init: init,
		run: run

	};

})();

export { App };
