import { App } from './app';

const UserData = (function () {
	function handle (object, userData) {
		const f = {
			collidable: (action) => addCollidables(object, action),
			draggable: (action) => addDraggables(object, action),
			faceable: (action) => addFaceable(object, action),
			movingLimiter: (action) => setMovingLimits(object, action)
		};

		for (const action in userData) {
			if (userData[action] && f[action]) {
				f[action](action);
			}
		}

		object.userData = { ...object.userData, ...userData };
	}

	function setMovingLimits (object, action) {
		const THREE = App.THREE;
		const boundingBox = new THREE.Box3();
		boundingBox.setFromObject(object);

		App.movingLimits = {
			min: boundingBox.min,
			max: boundingBox.max
		};
	}

	function addDraggables (object, action) {
		if (action) {
			App.draggables.push(object);
		}
	}

	function addCollidables (object, action) {
		if (action) {
			App.collidables.push(object);
		}
	}

	function addFaceable (object, action) {
		if (action) {
			App.faceables.push(object);
		}
	}

	return {
		handle
	};
})(App);

export { UserData };
