import { App } from './app';
import { Utils } from '../utils';

const Material = (function () {
	function create (options) {
		if (!options) {
			options = {

				type: 'MeshPhongMaterial',
				args: [{ color: 0xffffff }]

			};

			App.info('No options for material given, using default MeshPhongMaterial in white');
		}

		let material = App.create(options);

		material = change(material, options);

		return material;
	}

	function change (object, options) {
		const THREE = App.THREE;

		if (options.properties) {
			object = applyProperties(object, options.properties);
		}

		if (options.methods) {
			object = Utils.applyMethods(object, options.methods);
		}

		if (options.textures) {
			options.textures.forEach(async texture => {
				const loaderType = texture.loader || 'TextureLoader';
				const loader = new THREE[loaderType](App.manager);
				const mapType = texture.map;
				const mapTexture = await loader.loadAsync(texture.url);

				object[mapType] = mapTexture;

				if (texture.properties) {
					object[mapType] = applyProperties(object[mapType], texture.properties);
				}

				if (texture.methods) {
					object[mapType] = Utils.applyMethods(object, texture.methods);
				}
			});

			object.needsUpdate = true;
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

		create,
		change

	};
})(App);

export { Material };
