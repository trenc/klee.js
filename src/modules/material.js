import { App } from './app';
import { Utils } from '../utils';

const Material = (function () {

	function create (options) {

		if (!options) {

			options = {

				type: 'MeshPhongMaterial',
				args: [{ color: 0xffffff }]

			};

		}

		let material = App.create(options);

		material = change(material, options);

		return material;

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

				object[prop] = { ...options[prop] };

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

	return {

		create: create,
		change: change

	};

})(App);

export { Material };
