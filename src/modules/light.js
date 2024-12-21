import { App } from './app';
import { Object3d } from './object3d';

const Light = (function () {
	function create (options) {
		const light = Object3d.create(options);

		return light;
	}

	function change (light, options) {
		light = Object3d.change(light, options);

		return light;
	}

	function add (options) {
		if (typeof options === 'object' && options.type) {
			return addOne(options);
		}

		const lights = [];

		if (Array.isArray(options)) {
			options.forEach(option => {
				const light = addOne(option);

				lights.push(light);
			});
		}

		return lights;
	}

	function addOne (options) {
		const light = create(options);

		App.scene.add(light);

		return light;
	}

	return {

		add,
		create,
		change

	};
})(App);

export { Light };
