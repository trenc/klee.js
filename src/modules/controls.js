import { App } from './app';
import { Object3d } from './object3d';

const Controls = (function () {

	function init (Controls, options) {

		App.controls = initControls(Controls, options);

	}

	function initControls (Controls, options) {

		let controls = new Controls(App.camera, App.renderer.domElement);

		controls = Object3d.change(controls, options);

		return controls;

	}

	return {

		init: init

	};

})(App);

export { Controls };
