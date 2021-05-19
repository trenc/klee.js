class Utils {

	// https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6
	// mutates target for read-only properties
	static merge (target, source) {

		if (!source || typeof source !== 'object') {

			return target;

		}

		for (const key of Object.keys(source)) {

			if (source[key] instanceof Object) {

				Object.assign(source[key], this.merge(target[key], source[key]));

			}

		}

		Object.assign(target || {}, source);

		return target;

	}

	static isThreeColorValue (string) {

		const colorProperties = [

			'color',
			'specular',
			'emissive',
			'diffuse',
			'background'

		];

		return colorProperties.includes(string);

	}

	static applyMethods (object, methods) {

		methods = methods || {};

		for (const method in methods) {

			const args = Array.isArray(methods[method]) ? methods[method] : [];

			if (!(method in object)) {

				console.log('Applied object has no method: ' + method);

			} else {

				object[method](...args);

			}

		}

		return object;

	}

}

export { Utils };
