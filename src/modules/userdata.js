import { App } from './app';
import { Material } from './material';

const UserData = (function () {

	function handle (object, userData) {

		const f = {

			draggable: (action) => addDraggables(object, action),
			dragMaterial: (action) => createDragMaterial(object, action)

		};

		for (const action in userData) {

			if (!f[action]) {

				App.info('The userData »' + action + '« can not be handled by app.');

				return;

			}

			f[action](action);

		}

		object.userData = { ...userData };

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
