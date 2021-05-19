import { App } from './app';
import { Utils } from '../utils';

const Geometry = (function () {

	function create (options) {

		if (!options) {

			options = {

				type: 'BoxGeometry',
				args: [1, 1, 1]

			};

			App.info('No options for geometry given, using default BoxGeometry 1x1x1');

		}

		let geometry = App.create(options);

		geometry = Utils.merge(geometry, options.properties);

		return geometry;

	}

	return {

		create: create

	};

})(App);

export { Geometry };
