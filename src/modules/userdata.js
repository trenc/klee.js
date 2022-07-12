import { App } from './app';
import { Material } from './material';
import { Utils } from '../utils';

const UserData = (function () {

	function handle (object, userData) {

		const f = {

			draggable: (action) => addDraggables(object, action),
			dragMaterial: (action) => createDragMaterial(object, action),
			movingLimiter: (action) => setMovingLimits(object, action)

		};

		for (const action in userData) {

			if (f[action]) {

				f[action](action);

			}

		}

		object.userData = { ...object.userData, ...userData };

	}

	function setMovingLimits(object, action) {

		const THREE = App.THREE;
		const boundingBox = new THREE.Box3();
		boundingBox.setFromObject(object);

		App.movingLimits = {
			min: boundingBox.min,
			max: boundingBox.max
		};

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
