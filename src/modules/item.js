import { App } from './app';
import { Object3d } from './object3d';
import { Material } from './material';
import { Geometry } from './geometry';
import { Loaders } from './loaders';

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
			let parent = wrapGroupParent(item.scene, options);

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

		const box = new THREE.Box3().setFromObject(item);

		const center = box.getCenter(new THREE.Vector3());

		const offset = 0.001; // when clipping effects occur set this to 0.001

		const dim = {
			x: box.max.x - box.min.x + offset,
			y: box.max.y - box.min.y + offset,
			z: box.max.z - box.min.z + offset
		};

		const geo = new THREE.BoxGeometry(dim.x, dim.y, dim.z);

		if (!options.material) {
			options.material = {

				color: 0xffffff,
				transparent: true,
				opacity: 0

			};
		}

		const mat = new THREE.MeshBasicMaterial(options.material);
		const mesh = new THREE.Mesh(geo, mat);

		mesh.position.y = (dim.y / 2);
		item.position.x += (item.position.x - center.x);
		item.position.y += (item.position.y - center.y);
		item.position.z += (item.position.z - center.z);

		mesh.renderOrder = 1;

		item.traverse(child => {
			if (child.isMesh) {
				child.receiveShadow = options.properties.receiveShadow || false;
				child.castShadow = options.properties.castShadow || false;
				child.material.side = THREE.DoubleSide;
			}
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

	function remove (object) {
		App.collidables = App.collidables.filter(item => item !== object);
		App.draggables = App.draggables.filter(item => item !== object);
		App.faceables = App.faceables.filter(item => item !== object);

    object.removeFromParent();
	}

	return {

		add,
		create,
		change,
		remove

	};
})(App);

export { Item };
