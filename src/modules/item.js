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

	async function addFromLoader (options) {

		let item = await Loaders.load(options);

		if (item.scene) {

			let parent = wrapGroupParent (item.scene, options);

			parent = change(parent, options);

			parent.receiveShadow = false;
			parent.castShadow = false;

			App.scene.add(parent);

			return parent;


		} else {

			item = change(item, options);

			App.scene.add(item);

			return item;

		}

	}

	function wrapGroupParent (item, options) {

		const THREE = App.THREE;

		const offset = 0.001;

		const box = new THREE.Box3().setFromObject(item);

		const dim = {
			'x': box.max.x - box.min.x + offset,
			'y': box.max.y - box.min.y + offset,
			'z': box.max.z - box.min.z + offset
		};

		const geo = new THREE.BoxGeometry(dim.x, dim.y, dim.z);

		options.color = 0xffffff;
		options.transparent = true;
		options.opacity = 0;

		const mat = new THREE.MeshBasicMaterial(options);
		const mesh = new THREE.Mesh(geo, mat);

		item.position.y = (dim.y / -2);
		mesh.position.y = (dim.y);
		mesh.renderOrder = 1;

		item.children.map(child => {

			child.receiveShadow = options.properties.receiveShadow || false;
			child.castShadow = options.properties.castShadow || false;

		});

		mesh.add(item);

		return mesh;

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
