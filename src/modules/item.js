import { App } from './app';
import { Object3d } from './object3d';
import { Material } from './material';
import { Geometry } from './geometry';

const Item = (function () {

	function create (options) {

		const THREE = App.THREE;

		const material = Material.create(options.material);
		const geometry = Geometry.create(options.geometry);

		let mesh = new THREE.Mesh(geometry, material);
		mesh = change(mesh, options);

		return mesh;

	}

	function add (options) {

		if (typeof options === 'object' && options.geometry) {

			return addOne(options);

		}

		const items = [];

		if (Array.isArray(options)) {

			options.forEach(option => {

				const item = addOne(option);

				items.push(item);

			});

		}

		return items;

	}

	function addOne (options) {

		const mesh = create(options);

		App.scene.add(mesh);

		return mesh;

	}

	function change (object, options) {

		object = Object3d.change(object, options);

		return object;

	}

	return {

		add: add,
		create: create,
		change: change

	};

})(App);

export { Item };
