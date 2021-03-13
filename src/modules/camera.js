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

		return scene;

	}

	function initCamera (options) {

		const camera = Object3d.create(options);

		camera.updateProjectionMatrix();

		return camera;

	}

	return {

		init: init

	};

})(App);

export { Scene };
