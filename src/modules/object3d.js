import { App } from './app';
import { Utils } from '../utils';

const Object3d = (function () {

	function add (options) {

		const object3d = create(options);

		App.scene.add(object3d);

		return object3d;

	}

	function create (options) {

		const THREE = App.THREE;

		const args = Array.isArray(options.args) ? options.args : [];
		let object = new THREE[options.type](...args);

		object = change(object, options);

		return object;

	}

	function change (object, options) {

		if (options.properties) {

			object = applyProperties(object, options.properties);

		}

		if (options.methods) {

			object = Utils.applyMethods(object, options.methods);

		}

		return object;

	}

	function applyProperties (object, options) {

		const THREE = App.THREE;

		if (!options || typeof options !== 'object') {

			return object;

		}

		for (const prop in options) {

			if (options[prop] instanceof Object) {

				// apply vectors
				if (isVector(object[prop])) {

					const v = { ...object[prop], ...options[prop] };

					object[prop].copy(v);

				} else {

					object[prop] = applyProperties(object[prop], options[prop]);

				}

			} else {

				if (Utils.isThreeColorValue(prop)) {

					object[prop] = new THREE.Color(options[prop]);

				} else {

					object[prop] = options[prop];

				}

			}

		}

		return object;

	}

	function isVector (object) {

		const THREE = App.THREE;

		return (
			object instanceof THREE.Vector2 ||
			object instanceof THREE.Vector3 ||
			object instanceof THREE.Vector4
		);

	}

	return {

		add: add,
		create: create,
		change: change

	};

})(App);

export { Object3d };
