import { App } from './app';
import { Material } from './material';
import { Utils } from '../utils';

const UserData = (function () {

	function handle (object, userData) {

		const f = {

			draggable: (action) => addDraggables(object, action),
			dragMaterial: (action) => createDragMaterial(object, action)

		};

		for (const action in userData) {

			if (f[action]) {

				f[action](action);

			}

		}

		object.userData = { ...object.userData, ...userData };

	}

	function createDragMaterial (object, action) {

		return;

	}

	function addDraggables (object, action) {

		if (action) {

			App.draggables.push(object);

		}

	}

	return {

		handle: handle

	};

})(App);

export { UserData };
