import { App } from './app';
import { Object3d } from './object3d';
import { Material } from './material';
import { Geometry } from './geometry';
import {Loaders} from './loaders';

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

		if (typeof options === 'object') {

			if (options.loader) {

				return addFromLoader(options);

			}

			if (options.geometry) {

				return addMesh(options);

			}

		}

		const items = [];

		if (Array.isArray(options)) {

			options.forEach(option => {

				const item = add(option);

				items.push(item);

			});

		}

		return items;

	}

	function addFromLoader (option) {

		const item = Loaders.load(option);

		App.scene.add(item);

		return item;

	}

	function addMesh (options) {

		const mesh = create(options);

		App.scene.add(mesh);

		return mesh;

	}

	function change (object, options) {

		object = Object3d.change(object, options);

		if (options.material) {

			Material.change(object.material, options.material);

		}

		return object;

	}

	return {

		add: add,
		create: create,
		change: change

	};

})(App);

export { Item };
