import { App } from './app';
import { Object3d } from './object3d';

const Controls = (function () {

	function init (Controls, options) {

		App.controls[Controls.name] = initControls(Controls, options);

	}

	function initControls (Controls, options, objects = null) {

		let controls = null;

		if (Controls.name === 'DragControls') {

			controls = new Controls(App.draggables, App.camera, App.renderer.domElement);

		} else {

			controls = new Controls(App.camera, App.renderer.domElement);

		}

		controls = Object3d.change(controls, options);

		return controls;

	}

	return {

		init: init

	};

})(App);

export { Controls };
