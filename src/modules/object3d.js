import { App } from './app';
import { Utils } from '../utils';
import { UserData } from './userdata';

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
				// prefer prototype »copy» property before direct assignment
				// this handles non-writable object like Vectors, Euler, Quaternions etc.
				if (typeof object[prop] !== 'undefined' && 'copy' in object[prop]) {
					// a workaround for THREE.Euler which does use underscored properties
					// in »copy« method
					if ('setFromVector3' in object[prop]) {
						const toVector3 = new THREE.Vector3();
						toVector3.setFromEuler(object[prop]);
						const mergedVector3 = { ...toVector3, ...options[prop] };

						object[prop].setFromVector3(mergedVector3);
					}

					const v = { ...object[prop], ...options[prop] };

					object[prop].copy(v);
				} else {
					if (prop === 'userData') {
						UserData.handle(object, options[prop]);
					} else {
						object[prop] = applyProperties(object[prop], options[prop]);
					}
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

	return {

		add,
		create,
		change

	};
})(App);

export { Object3d };
