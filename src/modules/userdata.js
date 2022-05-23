import { App } from './app';

const UserData = (function () {

	function handle (object, userData) {

		const f = {

			draggable: (action) => draggables(object, action)

		};

		for (const action in userData) {

			if (!f[action]) {

				App.warn('The userData »' + action + '« can not handled by app.');

			}

			f[action](action);

		}

	}

	function draggables (object, action) {

		if (action) {

			App.draggables.push(object);

		}

	}

	return {

		handle: handle

	};

})(App);

export { UserData };
