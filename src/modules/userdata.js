import { App } from './app';

const UserData = (function () {

	function handle (object, userData) {

		const f = {

			draggable: (action) => addDraggables(object, action),
			raycasterPlane: (action) => setRaycasterPlane(object, action)

		};

		for (const action in userData) {

			if (!f[action]) {

				App.warn('The userData »' + action + '« can not be handled by app.');

			}

			f[action](action);

		}

	}

	function addDraggables (object, action) {

		if (action) {

			App.draggables.push(object);

		}

	}

	function setRaycasterPlane (object, action) {

		if (action) {

			App.raycasterPlane = object;

		}

	}

	return {

		handle: handle

	};

})(App);

export { UserData };
