import { App } from './app';
import { Object3d } from './object3d';

const Scene = (function () {
	function init () {
		const options = App.options;

		App.camera = initCamera(options.camera);
		App.scene = initScene(options.scene);

		App.initSize();
	}

	function initScene (options) {
		const scene = Object3d.create(options);

		(async () => {
			scene.background = await createSceneTextures(options.background);

			scene.environment = await createSceneTextures(options.environment);
		})();

		return scene;
	}

	function initCamera (options) {
		const camera = Object3d.create(options);

		camera.updateProjectionMatrix();

		return camera;
	}

	async function createSceneTextures (options) {
		if (!options) {
			return null;
		}

		const THREE = App.THREE;

		const loaderType = options.loader || 'TextureLoader';
		const loader = new THREE[loaderType](App.manager);
		const texture = await loader.loadAsync(options.url);

		return texture;
	}

	return {

		init

	};
})(App);

export { Scene };
